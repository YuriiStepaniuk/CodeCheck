import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TaskModule } from '../../task/task.module';
import { AiController } from './ai.controller';

@Module({
  imports: [TaskModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
