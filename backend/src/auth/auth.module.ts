import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
