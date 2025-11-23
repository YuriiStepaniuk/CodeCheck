import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findByUserId(userId: string) {
    return this.studentRepo.findOneBy({ userId });
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
}
