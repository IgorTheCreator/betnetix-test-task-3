import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreatePostDto, AllPostsQueryDto } from './dto';
import { User } from 'src/common/decorators';
import { IUser } from 'src/common/interfaces';
import { LikesService } from 'src/likes/likes.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() post: CreatePostDto, @User() user: IUser) {
    const createdPost = await this.postsService.createPost(post, user);

    return { ...createdPost };
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findPosts(@Query() query: AllPostsQueryDto) {
    const posts = await this.postsService.findPosts(query);

    return posts;
  }

  @Get('/:postId')
  async findPostById(@Param('postId', ParseIntPipe) postId: number) {
    const post = await this.postsService.findPostById(postId);
    if (!post) {
      throw new NotFoundException('Post does not exists');
    }

    return { ...post };
  }

  @Delete('/:postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: IUser,
  ) {
    await this.postsService.deletePost(postId, user);
  }

  @Post('/:postId/likes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: IUser,
  ) {
    await this.likesService.likePost(postId, user.userId);
  }

  @Delete('/:postId/likes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLike(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: IUser,
  ) {
    await this.likesService.deleteLike(postId, user.userId);
  }

  @Get('/:postId/likes')
  async countLikes(@Param('postId', ParseIntPipe) postId: number) {
    const likes = await this.postsService.countLikes(postId);
    return { postId, likes };
  }
}
