import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../user/types/role.enum';
import { RolesGuard } from '../shared/guards/roles.guard';
import { CreateTeacherByAdminDto } from '../teacher/dto/create-teacher-by-admin.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../user/user.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Request } from 'express';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-teacher')
  @Roles(Role.Admin)
  async createTeacher(
    @Req() req: Request,
    @Body() dto: CreateTeacherByAdminDto,
  ): Promise<{ user: User; teacher: Teacher }> {
    console.log(req.cookies);
    return this.adminService.createTeacher(dto);
  }
}
