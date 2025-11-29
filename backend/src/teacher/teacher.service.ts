import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepo.find();
  }

  async findByUserId(userId: string): Promise<Teacher | null> {
    const teacher = await this.teacherRepo.findOne({ where: { userId } });

    return teacher;
  }

  async create(
    data: { userId: string },
    manager?: EntityManager,
  ): Promise<Teacher> {
    const repo = manager ? manager.getRepository(Teacher) : this.teacherRepo;

    const teacher = repo.create(data);
    return repo.save(teacher);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    return this.userService.changePassword(userId, dto);
  }
}
