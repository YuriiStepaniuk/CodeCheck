import { Controller, Post, Body } from '@nestjs/common';
import { CodeService } from './code.service';
import { RunCodeDto } from './dtos/run-code.dto';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('submit')
  async submitSolution(@Body() dto: RunCodeDto) {
    console.log(dto);
    return this.codeService.submitSolution(dto.code, dto.taskId);
  }
}
