import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async likePost(postId: number, userId: number) {
    try {
      await this.prismaService.like.create({
        data: {
          postId,
          userId,
        },
      });
    } catch (err) {
      return;
    }
  }

  async deleteLike(postId: number, userId: number) {
    try {
      await this.prismaService.like.delete({
        where: {
          postId,
          userId,
        },
      });
    } catch (err) {
      return;
    }
  }
}
