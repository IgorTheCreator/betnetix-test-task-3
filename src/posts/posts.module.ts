import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  imports: [PrismaModule, LikesModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
