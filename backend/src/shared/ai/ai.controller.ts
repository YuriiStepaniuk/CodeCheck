import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { TaskService } from '../../task/task.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { GetHintDto } from './dtos/get-hint.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly taskService: TaskService,
  ) {}

  @Post('hint')
  async getHint(@Body() dto: GetHintDto) {
    const task = await this.taskService.findById(dto.taskId);
    if (!task) throw new NotFoundException('Task not found');

    return this.aiService.generateHint(
      task.title,
      task.description,
      dto.userCode,
      dto.failureContext,
    );
  }
}
