import { Injectable, NotFoundException } from '@nestjs/common';
import { TUpdateUser } from '@redundant/common/src';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, data: TUpdateUser) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return user;
  }
}
