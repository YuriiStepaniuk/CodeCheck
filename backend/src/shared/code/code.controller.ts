import { Controller, Post, Body } from '@nestjs/common';
import { CodeService } from './code.service';
import { RunCodeDto } from './dtos/run-code.dto';
import { StudentTaskService } from '../../assignment/student-task.service';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('code')
export class CodeController {
  constructor(
    private readonly codeService: CodeService,
    private readonly studentTaskService: StudentTaskService,
  ) {}

  @Post('submit')
  async submitSolution(@Body() dto: RunCodeDto, @CurrentUser() userId: string) {
    const result = await this.codeService.submitSolution(
      dto.code,
      dto.taskId,
      dto.language,
    );

    if (result.success && result.allPassed) {
      await this.studentTaskService.recordSuccess(
        userId,
        dto.taskId,
        dto.code,
        dto.language,
      );
    }

    return result;
  }
}
