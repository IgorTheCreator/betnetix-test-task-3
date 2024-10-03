import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareHash, generateHash } from './utils';
import { RegisterDto } from './dto';
import { IUser } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const existingUser = await this.usersService.findUser({ username });

    // Проверяем существует ли пользователь с введеным username
    if (!existingUser) {
      return null;
    }

    // Проверям хэши паролей
    if (!(await compareHash(password, existingUser.password))) {
      return null;
    }

    return { userId: existingUser.id, username: existingUser.username };
  }

  async login(user: IUser) {
    const payload = { userId: user.userId, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async register({ username, password }: RegisterDto) {
    const existingUser = await this.usersService.findUser({ username });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await generateHash(password);
    const user = await this.usersService.createUser({
      username,
      password: hashedPassword,
    });
    return user.id;
  }
}
