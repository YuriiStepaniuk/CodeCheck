import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TeacherModule } from '../teacher/teacher.module';
import { TaskController } from './task.controller';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TeacherModule, GroupModule],
  exports: [TaskService],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
