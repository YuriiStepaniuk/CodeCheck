import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../user/types/role.enum';
import { AuthenticatedUser } from '../auth/jwt/jwt-payload';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Roles(Role.Teacher)
  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateGroupDto,
  ) {
    return this.groupService.create(dto, user.userId);
  }

  @Post('/join')
  @Roles(Role.Student)
  async join(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: JoinGroupDto,
  ) {
    return this.groupService.assignGroup(user.userId, dto.inviteCode);
  }

  @Get('all-groups')
  @Roles(Role.Teacher)
  async findAllGroups() {
    return this.groupService.findAll();
  }
}
