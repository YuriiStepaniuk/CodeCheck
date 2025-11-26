import { Controller, Get, UseGuards } from '@nestjs/common';
import { StudentTaskService } from './student-task.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-payload';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class StudentTaskController {
  constructor(private readonly studentTaskService: StudentTaskService) {}

  @Get('my-grades')
  async getMyGrades(@CurrentUser() user: JwtPayload) {
    return this.studentTaskService.getStudentGrades(user.sub);
  }
}
