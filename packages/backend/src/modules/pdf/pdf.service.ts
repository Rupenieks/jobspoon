import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { env } from 'process';
import puppeteer from 'puppeteer';
import { connect } from 'puppeteer';
import { ResumeParserService } from '../resume-parser/resume-parser.service';
import { PDFDocument } from 'pdf-lib';
import { StorageService } from '../storage/storage.service';
import { TResumeFull } from '@redundant/common';

@Injectable()
export class PDFService {
  private readonly logger = new Logger(PDFService.name);
  private readonly browserURL: string;
  private readonly environment: string;

  constructor(
    private readonly resumeParserService: ResumeParserService,
    private readonly storageService: StorageService,
  ) {
    this.environment = process.env.NODE_ENV || 'development';

    // In development, use Chrome container
    if (this.environment === 'development') {
      const chromeUrl = env.CHROME_URL;
      const chromeToken = env.CHROME_TOKEN;
      this.browserURL = `${chromeUrl}?token=${chromeToken}`;
    } else {
      // In staging/production, use Chrome AWS Lambda
      this.browserURL = process.env.PREVIEW_URL || 'http://localhost:3001';
    }
  }

  private async getBrowser() {
    try {
      if (this.environment === 'development') {
        this.logger.debug(
          `Attempting to connect to browser at: ${this.browserURL}`,
        );
        return await connect({
          browserWSEndpoint: this.browserURL,
          acceptInsecureCerts: true,
        });
      } else {
        // For staging/production, launch a new browser instance using bundled Chromium
        const puppeteer = require('puppeteer');
        return await puppeteer.launch({
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
          ],
          headless: 'new',
        });
      }
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        browserURL: this.browserURL,
        environment: this.environment,
      };

      this.logger.error('Failed to connect to browser:', errorDetails);

      throw new InternalServerErrorException(
        'Failed to connect to browser service',
        JSON.stringify(errorDetails),
      );
    }
  }

  private async waitForImages(page: any) {
    try {
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  img.onload = img.onerror = resolve;
                }),
            ),
        );
      });

      const failedImages = await page.evaluate(() => {
        const images = Array.from(document.images);

        return images
          .filter(
            (img) => !img.complete || !img.naturalWidth || !img.naturalHeight,
          )
          .map((img) => img.src);
      });

      this.logger.log(failedImages);

      if (failedImages.length > 0) {
        this.logger.warn('Some images failed to load:', failedImages);
      }
    } catch (error) {
      this.logger.error('Error waiting for images:', error);
      throw error;
    }
  }

  private async setupRequestInterception(page: any) {
    await page.setRequestInterception(true);

    page.on('request', async (request: any) => {
      const url = request.url();
      const viteHost = process.env.VITE_HOST;
      const useWsl = process.env.USE_WSL === 'true';

      if (useWsl && viteHost && url.includes(viteHost)) {
        const modifiedUrl = url.replace(viteHost, 'host.docker.internal');
        void request.continue({
          url: modifiedUrl,
          headers: {
            ...request.headers(),
            'Access-Control-Allow-Origin': '*',
          },
        });
      } else if (url.includes('storage.googleapis.com')) {
        try {
          // Make the request directly using fetch
          const response = await fetch(url, {
            headers: {
              Accept:
                'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              'Cache-Control': 'no-cache',
            },
          });

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const buffer = await response.arrayBuffer();

          // Continue the request with the fetched data
          void request.respond({
            status: 200,
            body: Buffer.from(buffer),
            contentType: response.headers.get('content-type') || 'image/jpeg',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'no-cache',
            },
          });
        } catch (error) {
          this.logger.error(`Failed to fetch image from GCS: ${url}`, error);
          void request.abort();
        }
      } else {
        void request.continue();
      }
    });

    page.on('requestfailed', (request: any) => {
      this.logger.error(`Request failed: ${request.url()}`, {
        errorText: request.failure()?.errorText,
        url: request.url(),
      });
    });

    // Add console logging for responses
    page.on('response', async (response: any) => {
      const request = response.request();
      const url = request.url();
      if (url.includes('storage.googleapis.com')) {
        this.logger.debug(
          `Response from GCS: ${url}, Status: ${response.status()}`,
        );
      }
    });
  }

  private getPreviewUrl(): string {
    const useWsl = process.env.USE_WSL === 'true';
    const viteHost = process.env.VITE_HOST || 'localhost';
    const vitePort = process.env.VITE_PORT || '3001';
    const environment = process.env.NODE_ENV || 'development';

    if (environment === 'development') {
      if (useWsl) {
        return `http://${viteHost}:${vitePort}/pdfPreview`;
      }

      return `http://host.docker.internal:${vitePort}/pdfPreview`;
    }

    return `${process.env.PREVIEW_URL}/pdfPreview`;
  }

  async generatePDF(
    resumeId: string,
    userId: string,
  ): Promise<Buffer | string> {
    const resume = await this.resumeParserService.getResumeById(
      resumeId,
      userId,
    );

    if (!resume) {
      throw new NotFoundException(`Resume with ID ${resumeId} not found`);
    }

    const pdfBuffer = await this.generatePDFBuffer(resume);

    // In production/staging, upload to storage and return URL
    return this.storageService.uploadObject({
      userId,
      buffer: pdfBuffer,
      filename: `${resume.id}.pdf`,
      type: 'resumes',
      contentType: 'application/pdf',
    });
  }

  private async generatePDFBuffer(resume: TResumeFull): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      await this.setupRequestInterception(page);
      await page.setViewport({ width: 794, height: 1123 }); // A4 width in pixels

      await page.evaluateOnNewDocument((data) => {
        window.localStorage.setItem('resume', JSON.stringify(data));
      }, resume.data);

      const previewUrl = this.getPreviewUrl();
      this.logger.debug(`Using preview URL: ${previewUrl}`);

      await page.goto(previewUrl, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000,
      });

      await Promise.all([
        page.waitForSelector('.preview', { visible: true }),
        page.evaluate(() => document.fonts.ready),
        this.waitForImages(page),
      ]);

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Generate PDF for each page
      for (let i = 0; i < resume.data.pages.length; i++) {
        // Hide all pages except current
        await page.evaluate((currentIndex) => {
          document.querySelectorAll('.preview').forEach((el, index) => {
            const element = el as HTMLElement;
            element.style.opacity = '0';
            element.style.position = 'absolute';
            element.style.display = 'block';
          });

          // Make current page visible
          const currentPreview = document.querySelectorAll('.preview')[
            currentIndex
          ] as HTMLElement;
          currentPreview.style.opacity = '1';
          currentPreview.style.position = 'relative';

          // Reset styles
          document.querySelectorAll('.preview').forEach((el, index) => {
            const element = el as HTMLElement;
            if (index === currentIndex) {
              element.style.opacity = '1';
              element.style.position = 'relative';
              element.style.display = 'block';
            } else {
              element.style.display = 'none';
            }
          });
        }, i);

        // Get the exact height including all content
        const pageHeight = await page.evaluate((currentIndex) => {
          const currentPreview = document.querySelectorAll('.preview')[
            currentIndex
          ] as HTMLElement;

          // Get the exact height including all content
          const computedStyle = window.getComputedStyle(currentPreview);
          const height = currentPreview.getBoundingClientRect().height;

          // Log the height for debugging
          console.log(`Page ${currentIndex + 1} actual height:`, height);

          return height;
        }, i);

        // Convert to mm using exact pixel ratio
        const pixelsPerMm = 96 / 25.4; // Standard pixel density
        const heightInMm = pageHeight / pixelsPerMm;

        // Generate PDF for current page with actual height
        const singlePageBuffer = await page.pdf({
          width: '210mm',
          height: `${heightInMm}mm`,
          printBackground: true,
          preferCSSPageSize: true,
          pageRanges: '1',
          margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
          },
        });

        // Load the single page PDF and copy it to the merged document
        const singlePagePdf = await PDFDocument.load(singlePageBuffer);
        const [copiedPage] = await mergedPdf.copyPages(singlePagePdf, [0]);
        mergedPdf.addPage(copiedPage);
      }

      // Save the final merged PDF
      const finalPdfBytes = await mergedPdf.save();
      return Buffer.from(finalPdfBytes);
    } catch (error) {
      this.logger.error('Error generating PDF:', error);
      throw new InternalServerErrorException(
        'Failed to generate PDF',
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      await page.close();
      await browser.disconnect();
    }
  }
}
