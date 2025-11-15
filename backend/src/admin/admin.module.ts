import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { UserModule } from '../user/user.module';
import { TeacherModule } from '../teacher/teacher.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), UserModule, TeacherModule],
  exports: [],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
