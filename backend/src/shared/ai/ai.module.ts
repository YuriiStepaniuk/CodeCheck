import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TaskModule } from '../../task/task.module';
import { AiController } from './ai.controller';
import { AssignmentModule } from '../../assignment/assignment.module';

@Module({
  imports: [TaskModule, AssignmentModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
