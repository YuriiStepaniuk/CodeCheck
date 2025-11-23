import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentStatus, StudentTask } from './entities/student-task.entity';
import { StudentService } from '../student/student.service';

@Injectable()
export class StudentTaskService {
  constructor(
    @InjectRepository(StudentTask)
    private repo: Repository<StudentTask>,
    private readonly studentService: StudentService,
  ) {}

  async incrementHintUsage(userId: string, taskId: string): Promise<void> {
    const student = await this.studentService.findByUserId(userId);
    if (!student) throw new NotFoundException('Student profile not found');

    let assignment = await this.repo.findOne({
      where: {
        student: { id: student.id },
        task: { id: taskId },
      },
    });

    if (!assignment) {
      assignment = this.repo.create({
        student: student,
        task: { id: taskId },
        status: AssignmentStatus.ASSIGNED,
        hintsUsed: 0,
        attempts: 0,
      });
    }

    if (assignment.status !== AssignmentStatus.GRADED) {
      assignment.hintsUsed += 1;
      await this.repo.save(assignment);
    }
  }

  async recordSuccess(userId: string, taskId: string): Promise<StudentTask> {
    const student = await this.studentService.findByUserId(userId);
    if (!student) throw new NotFoundException('Student profile not found');

    let assignment = await this.repo.findOne({
      where: {
        student: { id: student.id },
        task: { id: taskId },
      },
      relations: ['task'],
    });

    if (!assignment) {
      assignment = this.repo.create({
        student: student,
        task: { id: taskId },
        hintsUsed: 0,
        attempts: 1,
        status: AssignmentStatus.ASSIGNED,
      });
    }

    if (assignment.status === AssignmentStatus.GRADED) {
      assignment.attempts += 1;
      return this.repo.save(assignment);
    }

    const maxPoints = assignment.task?.points || 10;
    const HINT_COST = 5;

    const penalty = assignment.hintsUsed * HINT_COST;
    const finalGrade = Math.max(0, maxPoints - penalty);

    assignment.status = AssignmentStatus.GRADED;
    assignment.grade = finalGrade;
    assignment.attempts += 1;
    assignment.feedback = `Passed with ${assignment.hintsUsed} hints used.`;

    return this.repo.save(assignment);
  }
}
