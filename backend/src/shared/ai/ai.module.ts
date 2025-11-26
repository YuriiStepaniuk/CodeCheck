import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TaskModule } from '../../task/task.module';
import { AiController } from './ai.controller';
import { AssignmentModule } from '../../assignment/assignment.module';

@Module({
  imports: [TaskModule, forwardRef(() => AssignmentModule)],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
