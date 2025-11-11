import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentTask } from './entities/student-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentTask])],
  exports: [],
  providers: [],
  controllers: [],
})
export class AssignmentModule {}
