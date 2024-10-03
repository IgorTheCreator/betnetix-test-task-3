import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateUser } from './interfaces';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUser(query: Prisma.UserWhereInput): Promise<ICreateUser> {
    const user = await this.prismaService.user.findFirst({
      where: {
        ...query,
      },
    });
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<ICreateUser> {
    const user = await this.prismaService.user.create({ data: { ...data } });

    return user;
  }
}
