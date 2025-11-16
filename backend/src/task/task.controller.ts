import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../user/types/role.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { AuthenticatedRequest } from '../auth/jwt/authenticated-request';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.Teacher)
  async createTask(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateTaskDto,
  ): Promise<Task> {
    const userId = req.user.sub;

    return this.taskService.create(data, userId);
  }

  @Get('my-tasks')
  @Roles(Role.Teacher)
  async getMyTasks(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;

    return this.taskService.findByTeacherId(userId);
  }
}
