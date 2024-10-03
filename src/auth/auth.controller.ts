import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { User } from 'src/common/decorators';
import { IPayload } from './interfaces';
import { RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: IPayload) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: RegisterDto) {
    const userId = await this.authService.register(user);
    return { userId };
  }
}
