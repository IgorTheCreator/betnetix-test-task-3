import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { User } from 'src/common/decorators';
import { RegisterDto } from './dto';
import { IUser } from 'src/common/interfaces';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ description: 'Login' })
  @ApiOkResponse({ description: 'Access token' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@User() user: IUser) {
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ description: 'Register new user' })
  @ApiOkResponse({ description: 'userId of new created user' })
  @ApiBody({ type: RegisterDto })
  @ApiBadRequestResponse({ description: 'User already exists' })
  async register(@Body() user: RegisterDto) {
    const userId = await this.authService.register(user);
    return { userId };
  }
}
