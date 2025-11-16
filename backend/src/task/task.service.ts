import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TeacherService } from '../teacher/teacher.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly teacherService: TeacherService,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }

  async findByTeacherId(userId: string): Promise<Task[] | null> {
    const teacher = await this.teacherService.findByUserId(userId);

    if (!teacher) {
      throw new BadRequestException();
    }

    return this.taskRepo.find({
      where: {
        teacher: {
          id: teacher.id,
        },
      },
    });
  }

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const teacher = await this.teacherService.findByUserId(userId);

    if (!teacher) {
      throw new BadRequestException();
    }

    const starterCodeObj: Record<string, string> = {
      [dto.language]: dto.starterCode || '',
    };

    const task = this.taskRepo.create({
      ...dto,
      starterCode: starterCodeObj,
      teacher,
    });

    return this.taskRepo.save(task);
  }
}
