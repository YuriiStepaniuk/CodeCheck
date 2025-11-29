import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../user/types/role.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/jwt/jwt-payload';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.Teacher)
  async createTask(
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.create(data, user.userId);
  }

  @Get('my-tasks')
  @Roles(Role.Teacher)
  async getMyTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.taskService.findByTeacherId(user.userId);
  }

  @Get('available-tasks')
  @Roles(Role.Student)
  async getAvailableTasks() {
    return this.taskService.findTasksForStudent();
  }

  @Get(':id')
  @Roles(Role.Student)
  async getTask(@Param('id') id: string) {
    return this.taskService.findById(id);
  }
}
