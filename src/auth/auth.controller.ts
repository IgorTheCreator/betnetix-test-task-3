import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { User } from 'src/common/decorators';
import { RegisterDto } from './dto';
import { IUser } from 'src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: IUser) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: RegisterDto) {
    const userId = await this.authService.register(user);
    return { userId };
  }
}
