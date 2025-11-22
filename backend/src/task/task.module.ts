import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TeacherModule } from '../teacher/teacher.module';
import { TaskController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TeacherModule],
  exports: [TaskService],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
