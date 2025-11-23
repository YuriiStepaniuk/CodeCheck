import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentTask } from './entities/student-task.entity';
import { StudentTaskService } from './student-task.service';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudentTask]), StudentModule],
  exports: [StudentTaskService],
  providers: [StudentTaskService],
  controllers: [],
})
export class AssignmentModule {}
