import { Controller, Get, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Role } from '../user/types/role.enum';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/jwt/jwt-payload';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Student)
  @Get('my-groups')
  async getMyGroups(@CurrentUser() user: AuthenticatedUser) {
    return this.studentService.getStudentGroups(user.userId);
  }
}
