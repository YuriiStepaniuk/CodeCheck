import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TeacherService } from '../teacher/teacher.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Language } from './types/language';
import { GroupService } from '../group/group.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly teacherService: TeacherService,
    private readonly groupService: GroupService,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }

  async findById(taskId: string): Promise<Task | null> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });

    if (!task) {
      throw new BadRequestException('Task does not exist');
    }
    return task;
  }

  async findTasksForStudent(groupId?: string) {
    const where: FindOptionsWhere<Task> = {};

    if (groupId) {
      where.group = { id: groupId };
    }

    return this.taskRepo.find({
      where,
      relations: {
        teacher: true,
        group: true,
      },
    });
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
      throw new BadRequestException('Teacher profile not found');
    }

    const group = await this.groupService.findById(dto.groupId);

    if (!group) {
      throw new BadRequestException('Group was not found');
    }

    const entryFuncName = dto.entryFunctionName || 'solution';

    const codeContent =
      dto.starterCode ||
      this.getDefaultStarterCode(dto.language, entryFuncName);

    const starterCodeObj = {
      [dto.language]: codeContent,
    };

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      difficulty: dto.difficulty,
      language: dto.language,
      points: dto.points,
      starterCode: starterCodeObj,
      entryFunctionName: entryFuncName,
      testCases: dto.testCases,
      hints: dto.hints ?? [],
      teacher,
      group,
    });

    return this.taskRepo.save(task);
  }

  private getDefaultStarterCode(
    language: Language,
    functionName: string,
  ): string {
    switch (language) {
      case Language.JS:
        return `function ${functionName}(a, b) {\n  // Write your code here\n  return a + b;\n}`;

      case Language.TS:
        return `function ${functionName}(a: number, b: number): number {\n  // Write your code here\n  return a + b;\n}`;

      case Language.C:
        return `#include <stdio.h>\n\nint ${functionName}(int a, int b) {\n    // Write your code here\n    return a + b;\n}`;

      case Language.CSharp:
        return `public class Solution {\n    public int ${functionName}(int a, int b) {\n        // Write your code here\n        return a + b;\n    }\n}`;

      default:
        return '// Write your solution here';
    }
  }
}
