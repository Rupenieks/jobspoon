import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
      jwt: this.jwtService.sign(req.user),
    };
  }

  async validateGoogleToken(token: string) {
    // Here you would typically verify the token with Google's API
    // For simplicity, we'll just decode it and assume it's valid
    const decoded = this.jwtService.decode(token);
    if (!decoded) {
      return null;
    }
    // You should add more validation here
    return {
      email: decoded['email'],
      firstName: decoded['given_name'],
      lastName: decoded['family_name'],
      picture: decoded['picture'],
    };
  }
}
