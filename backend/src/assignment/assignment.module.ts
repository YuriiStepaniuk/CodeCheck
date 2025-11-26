import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentTask } from './entities/student-task.entity';
import { StudentTaskService } from './student-task.service';
import { StudentModule } from '../student/student.module';
import { StudentTaskController } from './student-task.controller';
import { TaskModule } from '../task/task.module';
import { AiModule } from '../shared/ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentTask]),
    StudentModule,
    TaskModule,
    AiModule,
  ],
  exports: [StudentTaskService],
  providers: [StudentTaskService],
  controllers: [StudentTaskController],
})
export class AssignmentModule {}
