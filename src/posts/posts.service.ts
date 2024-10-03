import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, AllPostsQueryDto } from './dto';
import { IUser } from 'src/common/interfaces';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost({ title, content }: CreatePostDto, { userId }: IUser) {
    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return post;
  }

  async findPosts(query: AllPostsQueryDto) {
    // Пагинация
    const take = query.limit;
    const skip = (query.page - 1) * query.limit;

    const posts = await this.prismaService.post.findMany({
      take,
      skip,
      where: {
        userId: query.userId,
      },
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    return posts;
  }

  async findPostById(postId: number) {
    const post = await this.prismaService.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    return post;
  }

  async deletePost(postId: number, user: IUser) {
    await this.prismaService.post.delete({
      where: {
        id: postId,
        userId: user.userId,
      },
    });
  }

  async countLikes(postId: number) {
    const {
      _count: { likes },
    } = await this.prismaService.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });
    return likes;
  }
}
