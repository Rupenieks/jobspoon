import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TUpdateUser } from '@redundant/common/src';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req) {
    return this.userService.findById(req.user.userId);
  }

  @Patch()
  async updateUser(@Req() req, @Body() updateData: TUpdateUser) {
    return this.userService.update(req.user.userId, updateData);
  }

  @Patch('onboarding')
  async onboarding(@Req() req, @Body() updateData: TUpdateUser) {
    return this.userService.update(req.user.userId, {
      ...updateData,
      isOnboarded: true,
    });
  }
}
