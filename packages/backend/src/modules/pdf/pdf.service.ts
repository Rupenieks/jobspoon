import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument } from 'pdf-lib';
import { connect } from 'puppeteer';
import { ResumeParserService } from '../resume-parser/resume-parser.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PDFService {
  private readonly logger = new Logger(PDFService.name);
  private readonly browserURL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly resumeParserService: ResumeParserService,
    private readonly httpService: HttpService,
  ) {
    const chromeUrl =
      this.configService.get('CHROME_URL') ?? 'ws://localhost:3000';
    const chromeToken =
      this.configService.get('CHROME_TOKEN') ?? 'your-secret-token';
    this.browserURL = `${chromeUrl}?token=${chromeToken}`;
  }

  private async getBrowser() {
    try {
      this.logger.debug(
        `Attempting to connect to browser at: ${this.browserURL}`,
      );

      return await connect({
        browserWSEndpoint: this.browserURL,
        acceptInsecureCerts: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to connect to browser:', {
        error: JSON.stringify(error),
        browserURL: this.browserURL,
      });

      throw new InternalServerErrorException(
        'Failed to connect to browser service. Please ensure Chrome is running.',
        errorMessage,
      );
    }
  }

  async generatePDF(resumeId: string, userId: string): Promise<Buffer> {
    const resume = await this.resumeParserService.getResumeById(
      resumeId,
      userId,
    );
    if (!resume) {
      throw new NotFoundException(`Resume with ID ${resumeId} not found`);
    }

    const browser = await this.getBrowser();
    const browserPage = await browser.newPage();

    try {
      await browserPage.setViewport({
        width: 794,
        height: 1123,
      });

      // Set resume data in localStorage before navigation
      await browserPage.evaluateOnNewDocument((data) => {
        window.localStorage.setItem('resume', JSON.stringify(data));
      }, resume.data);

      // Navigate to preview URL
      let previewUrl = 'http://localhost:3001/pdfPreview';
      if (process.env.NODE_ENV === 'development') {
        previewUrl = previewUrl.replace('localhost', 'host.docker.internal');
        await browserPage.setRequestInterception(true);
        browserPage.on('request', (request) => {
          const url = request
            .url()
            .replace('localhost', 'host.docker.internal');
          void request.continue({ url });
        });
      }

      // Wait for page load and network idle
      await browserPage.goto(previewUrl, {
        waitUntil: ['load', 'networkidle0'],
        timeout: 30000,
      });

      // Wait for the preview element with increased timeout
      await browserPage.waitForSelector('.preview', {
        timeout: 30000,
        visible: true,
      });

      // Wait for fonts to load
      await browserPage.evaluate(() => document.fonts.ready);

      // Add this before generating PDF
      await browserPage.setExtraHTTPHeaders({
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Access-Control-Allow-Origin': '*',
      });

      // Enable JavaScript and wait for network idle
      await browserPage.setJavaScriptEnabled(true);

      // Add this after setting viewport
      await browserPage.setRequestInterception(true);
      browserPage.on('request', (request) => {
        // Allow all image requests and handle CORS
        if (request.resourceType() === 'image') {
          request.continue({
            headers: {
              ...request.headers(),
              'Access-Control-Allow-Origin': '*',
            },
          });
        } else {
          request.continue();
        }
      });

      // Add this after setting extra HTTP headers
      await browserPage.setExtraHTTPHeaders({
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Access-Control-Allow-Origin': '*',
      });

      // Replace the image loading wait block with this enhanced version
      await browserPage.evaluate(async () => {
        const images = Array.from(document.getElementsByTagName('img'));
        await Promise.all(
          images.map((img) => {
            if (img.complete) {
              if (img.naturalHeight === 0) {
                throw new Error(`Image failed to load: ${img.src}`);
              }
              return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
              img.addEventListener('load', () => {
                if (img.naturalHeight === 0) {
                  reject(new Error(`Image failed to load: ${img.src}`));
                }
                resolve(undefined);
              });
              img.addEventListener('error', () =>
                reject(new Error(`Image failed to load: ${img.src}`)),
              );
            });
          }),
        );
      });

      // Add additional wait time for image processing
      await browserPage.waitForTimeout(1000);

      // Then proceed with PDF generation
      const pdfBuffer = await browserPage.pdf({
        format: 'A4',
        printBackground: true,
        timeout: 60000,
      });

      // Create PDF with embedded fonts
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);

      // Load and embed fonts if specified
      if (resume.data.config?.font) {
        try {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${resume.data.config.font}:wght@400;700&display=swap`;
          const fontResponse = await this.httpService.axiosRef.get(fontUrl);

          // Extract the actual font URL from the CSS response
          const fontUrls = fontResponse.data.match(/src: url\((.*?)\)/g);
          if (fontUrls && fontUrls.length > 0) {
            const fontFileUrl = fontUrls[0].match(/url\((.*?)\)/)[1];
            const fontFileResponse = await this.httpService.axiosRef.get(
              fontFileUrl,
              {
                responseType: 'arraybuffer',
              },
            );

            await pdfDoc.embedFont(fontFileResponse.data);
          }
        } catch (error) {
          this.logger.warn('Failed to embed font:', error);
          // Continue without the custom font if embedding fails
        }
      }

      // Merge the PDF with embedded fonts
      const originalPdf = await PDFDocument.load(pdfBuffer);
      const [pdfPage] = await pdfDoc.copyPages(originalPdf, [0]);
      pdfDoc.addPage(pdfPage);

      return Buffer.from(await pdfDoc.save());
    } finally {
      await browserPage.close();
      await browser.disconnect();
    }
  }
}
