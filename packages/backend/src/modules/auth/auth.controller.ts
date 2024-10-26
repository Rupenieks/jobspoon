import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body('credential') credential: string) {
    const user = await this.authService.validateGoogleToken(credential);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.googleLogin({ user });
  }
}
