import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { AuthenticatedUser, JwtPayload } from '../auth/jwt/jwt-payload';
import { Role } from '../user/types/role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Teacher)
  @Get('/me')
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.teacherService.findByUserId(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.teacherService.changePassword(user.userId, changePasswordDto);

    return { message: 'Password updated successfully' };
  }
}
