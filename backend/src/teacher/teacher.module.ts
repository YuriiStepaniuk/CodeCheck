import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), UserModule],
  providers: [TeacherService],
  exports: [TeacherService],
  controllers: [TeacherController],
})
export class TeacherModule {}
