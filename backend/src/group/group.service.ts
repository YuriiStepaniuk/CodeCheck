// src/group/group.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { TeacherService } from '../teacher/teacher.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,
  ) {}

  async create(dto: CreateGroupDto, userId: string) {
    const teacher = await this.teacherService.findByUserId(userId);
    if (!teacher) {
      throw new BadRequestException('Only valid teachers can create groups');
    }

    const group = this.groupRepository.create({
      name: dto.name,
      teacher: teacher,
    });

    return this.groupRepository.save(group);
  }

  async assignGroup(userId: string, inviteCode: string): Promise<void> {
    const student = await this.studentService.findByUserId(userId, {
      groups: true,
    });
    const group = await this.groupRepository.findOneBy({
      inviteCode: inviteCode,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const alreadyInGroup = student.groups.some((g) => g.id === group.id);
    if (alreadyInGroup) {
      throw new BadRequestException('You are already a member of this class');
    }

    student.groups.push(group);
    await this.studentService.save(student);
  }
}
