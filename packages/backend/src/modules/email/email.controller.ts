import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test-welcome')
  async testWelcomeEmail(@Body() body: { email: string; fullName: string }) {
    return this.emailService.sendWelcomeEmail(body.email, body.fullName);
  }
}
