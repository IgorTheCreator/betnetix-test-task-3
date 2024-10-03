import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LikesService } from './likes.service';

@Module({
  imports: [PrismaModule],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
