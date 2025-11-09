import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { HashService } from '../shared/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, HashService],
  exports: [UserService],
})
export class UserModule {}
