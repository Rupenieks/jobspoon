import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TResumeFull } from '@redundant/common';
import { PDFDocument } from 'pdf-lib';
import { connect } from 'puppeteer';
import { PDFConfig, getPDFConfig } from '../../config/pdf.config';
import { ResumeParserService } from '../resume-parser/resume-parser.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PDFService {
  private readonly logger = new Logger(PDFService.name);
  private readonly config: PDFConfig;

  constructor(
    private readonly resumeParserService: ResumeParserService,
    private readonly storageService: StorageService,
  ) {
    this.config = getPDFConfig();
  }

  private async getBrowser() {
    try {
      const browserWSEndpoint = `${this.config.chromeUrl}?token=${this.config.chromeToken}`;
      this.logger.debug(
        `Attempting to connect to browser at: ${browserWSEndpoint}`,
      );

      return await connect({
        browserWSEndpoint,
        acceptInsecureCerts: true,
      });
    } catch (error) {
      const errorDetails = {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        chromeUrl: this.config.chromeUrl,
        environment: process.env.NODE_ENV,
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

    this.logger.log('Generating PDF for resume:', {
      resumeId,
      userId,
    });

    if (!resume) {
      this.logger.error(`Resume not found.`, {
        resumeId,
        userId,
      });
      throw new NotFoundException(`Resume with ID ${resumeId} not found`);
    }

    const pdfBuffer = await this.generatePDFBuffer(resume);

    this.logger.log('PDF generated successfully:', {
      resumeId,
      userId,
    });

    try {
      return this.storageService.uploadObject({
        userId,
        buffer: pdfBuffer,
        filename: `${resume.id}.pdf`,
        type: 'resumes',
        contentType: 'application/pdf',
      });
    } catch (error) {
      this.logger.error('Error generating PDF or uploading to storage:', error);
      throw new InternalServerErrorException(
        'Failed to generate PDF',
        error instanceof Error ? error.message : String(error),
      );
    }
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
          document.querySelectorAll('.preview').forEach((el) => {
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
          const height = currentPreview.getBoundingClientRect().height;

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
