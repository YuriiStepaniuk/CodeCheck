import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsRelations, Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findByUserId(
    userId: string,
    relations: FindOptionsRelations<Student> = {},
  ) {
    return this.studentRepo.findOne({ where: { userId }, relations });
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepo.find();
  }

  async create(
    data: { userId: string },
    manager?: EntityManager,
  ): Promise<Student> {
    const repository = manager
      ? manager.getRepository(Student)
      : this.studentRepo;

    const student = repository.create(data);

    return repository.save(student);
  }

  save(student: Student) {
    return this.studentRepo.save(student);
  }

  async getStudentGroups(userId: string) {
    const student = await this.findByUserId(userId, {
      groups: {
        teacher: {
          user: true,
        },
      },
    });
    return student?.groups || [];
  }
}
