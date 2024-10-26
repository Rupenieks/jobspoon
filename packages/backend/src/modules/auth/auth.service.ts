import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const tokens = await this.generateTokens(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        picture: user.picture,
      },
    };
  }

  async register(email: string, password: string, fullName: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    });
    return this.login(user);
  }

  async validateGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }
      return {
        email: payload.email,
        fullName: payload.name,
        googleId: payload.sub,
        picture: payload.picture,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async googleLogin(googleUser: any) {
    const user = await this.prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        googleId: googleUser.googleId,
        picture: googleUser.picture, // Add this line
      },
      create: {
        email: googleUser.email,
        fullName: googleUser.fullName,
        googleId: googleUser.googleId,
        picture: googleUser.picture,
      },
    });
    return this.login(user);
  }

  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
