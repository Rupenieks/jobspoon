import { Injectable, Logger } from '@nestjs/common';
import { WelcomeEmail } from '@redundant/transactional';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(email: string, fullName: string) {
    try {
      const result = await this.resend.emails.send({
        from: 'JobSpoon <notifications@jobspoon.io>',
        to: email,
        subject: 'Welcome to JobSpoon! 🚀',
        react: WelcomeEmail({ fullName }),
      });

      if (result.error) {
        this.logger.error(
          `Failed to send welcome email to ${email}:`,
          result.error,
        );
        throw result.error;
      }

      this.logger.log(`Welcome email sent to ${email}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }
}
