import { Injectable, Logger } from '@nestjs/common';
import { WelcomeEmail } from '@redundant/transactional';
import { Resend } from 'resend';
import { render, renderAsync } from '@react-email/render';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private cleanHtml(html: string): string {
    return html
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\t/g, '\t')
      .trim();
  }

  async sendWelcomeEmail(email: string, fullName: string) {
    try {
      const rawHtml = await renderAsync(
        WelcomeEmail({
          fullName,
          loginUrl: `${process.env.BROWSER_URL}/login`,
        }),
        {
          pretty: true,
        },
      );

      const html = this.cleanHtml(rawHtml);

      this.logger.debug('Cleaned HTML:', html); // For debugging

      const { data, error } = await this.resend.emails.send({
        from: 'JobSpoon <notifications@jobspoon.io>',
        to: email,
        subject: 'Welcome to JobSpoon! 🚀',
        html,
      });

      if (error) {
        this.logger.error(`Failed to send welcome email to ${email}:`, error);
        throw error;
      }

      this.logger.log(`Welcome email sent to ${email}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }
}
