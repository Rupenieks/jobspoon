import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MatchWithApplicationSchema,
  TMatchWithApplication,
} from '@redundant/common';

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMatch(id: string): Promise<TMatchWithApplication> {
    const match = await this.prismaService.match.findUnique({
      where: { id },
      include: { application: true },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    const parsed = MatchWithApplicationSchema.parse(match);

    return parsed;
  }

  async getMatchesByResumeId(
    resumeId: string,
  ): Promise<TMatchWithApplication[]> {
    const matches = await this.prismaService.match.findMany({
      where: { resumeId },
      include: { application: true },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = matches.map((match) =>
      MatchWithApplicationSchema.parse(match),
    );

    return parsed;
  }
}
