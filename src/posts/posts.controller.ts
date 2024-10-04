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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create new post' })
  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDto })
  @ApiOkResponse({ description: 'Created post' })
  @ApiBadRequestResponse({ description: 'Wrong post data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() post: CreatePostDto, @User() user: IUser) {
    const createdPost = await this.postsService.createPost(post, user);

    return { ...createdPost };
  }

  @Get()
  @ApiOperation({ description: 'Get all posts' })
  @ApiOkResponse({ description: 'All posts according query params' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findPosts(@Query() query: AllPostsQueryDto) {
    const posts = await this.postsService.findPosts(query);

    return posts;
  }

  @Get('/:postId')
  @ApiOperation({ description: 'Get post by id' })
  @ApiParam({ name: 'postId', description: 'postId', type: Number })
  @ApiOkResponse({ description: 'Finded post by id' })
  @ApiNotFoundResponse({ description: 'Post does not exist' })
  async findPostById(@Param('postId', ParseIntPipe) postId: number) {
    const post = await this.postsService.findPostById(postId);
    if (!post) {
      throw new NotFoundException('Post does not exists');
    }

    return { ...post };
  }

  @Delete('/:postId')
  @ApiOperation({
    description: 'Delete post. Post can be delete only user who created it',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'postId', type: Number })
  @ApiNoContentResponse({ description: 'Post deleted' })
  @ApiNotFoundResponse({ description: 'Post with such postId not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: IUser,
  ) {
    await this.postsService.deletePost(postId, user);
  }

  @Post('/:postId/likes')
  @ApiOperation({ description: 'Like post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'postId', type: Number })
  @ApiNoContentResponse({ description: 'Post liked' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: IUser,
  ) {
    await this.likesService.likePost(postId, user.userId);
  }

  @Delete('/:postId/likes')
  @ApiOperation({ description: 'Delete like from post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'postId', type: Number })
  @ApiNoContentResponse({ description: 'Like from post was deleted' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLike(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: IUser,
  ) {
    await this.likesService.deleteLike(postId, user.userId);
  }

  @Get('/:postId/likes')
  @ApiOperation({ description: 'Get likes on a post' })
  @ApiParam({ name: 'postId', description: 'postId', type: Number })
  @ApiOkResponse({ description: 'postId and count of likes on the post' })
  @ApiNotFoundResponse({ description: 'Post does not exist' })
  async countLikes(@Param('postId', ParseIntPipe) postId: number) {
    const likes = await this.postsService.countLikes(postId);
    return { postId, likes };
  }
}
