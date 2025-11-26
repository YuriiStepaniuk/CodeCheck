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
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../auth/jwt/jwt-payload';
import { StudentTaskService } from '../../assignment/student-task.service';
import { EvaluateCodeDto } from './dtos/evaluate-code.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly taskService: TaskService,
    private readonly studentTaskService: StudentTaskService,
  ) {}

  @Post('hint')
  @UseGuards(JwtAuthGuard)
  async getHint(@Body() dto: GetHintDto, @CurrentUser() user: JwtPayload) {
    const task = await this.taskService.findById(dto.taskId);
    if (!task) throw new NotFoundException('Task not found');

    const hintResponse = await this.aiService.generateHint(
      task.title,
      task.description,
      dto.userCode,
      dto.failureContext,
    );

    await this.studentTaskService.incrementHintUsage(user.sub, dto.taskId);

    return typeof hintResponse === 'string'
      ? { hint: hintResponse }
      : hintResponse;
  }

  @Post('review')
  async evaluateCode(@Body() dto: EvaluateCodeDto) {
    const task = await this.taskService.findById(dto.taskId);
    if (!task) throw new NotFoundException('Task not found');

    const review = await this.aiService.generateCodeReview(
      task.title,
      task.description,
      dto.userCode,
      dto.language,
    );

    return { review };
  }
}
