import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentStatus, StudentTask } from './entities/student-task.entity';
import { StudentService } from '../student/student.service';
import { ASSIGNMENT_CONSTANTS } from './constants/assignment.constants';
import { TaskService } from '../task/task.service';
import { Language } from '../task/types/language';
import { AiService } from '../shared/ai/ai.service';

@Injectable()
export class StudentTaskService {
  constructor(
    @InjectRepository(StudentTask)
    private repo: Repository<StudentTask>,
    private readonly studentService: StudentService,
    private readonly taskService: TaskService,
    private readonly aiService: AiService,
  ) {}

  async getStudentGrades(userId: string): Promise<StudentTask[]> {
    const student = await this.studentService.findByUserId(userId);
    if (!student) throw new NotFoundException('Student not found');

    return this.repo.find({
      where: { student: { id: student.id } },
      relations: ['task', 'task.teacher'],
      order: { updatedAt: 'DESC' },
    });
  }

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

  async recordSuccess(
    userId: string,
    taskId: string,
    userCode: string,
    language: Language,
  ): Promise<StudentTask> {
    const student = await this.studentService.findByUserId(userId);
    if (!student) throw new NotFoundException('Student profile not found');

    const task = await this.taskService.findById(taskId);
    if (!task) throw new NotFoundException('Task was not found');

    let assignment = await this.repo.findOne({
      where: {
        student: { id: student.id },
        task: { id: taskId },
      },
    });
    if (!assignment) {
      assignment = this.repo.create({
        student: student,
        task: task,
        hintsUsed: 0,
        attempts: 1,
        status: AssignmentStatus.ASSIGNED,
      });
    }

    if (assignment.status === AssignmentStatus.GRADED) {
      assignment.attempts += 1;
      return this.repo.save(assignment);
    }

    const maxPoints = assignment.task.points;
    const penalty = assignment.hintsUsed * ASSIGNMENT_CONSTANTS.HINT_COST;
    const finalGrade = Math.max(0, maxPoints - penalty);

    assignment.status = AssignmentStatus.GRADED;
    assignment.grade = finalGrade;
    assignment.attempts += 1;
    assignment.feedback = `Passed with ${assignment.hintsUsed} hints used.`;

    try {
      const aiFeedback = await this.aiService.generateCodeReview(
        task.title,
        task.description,
        userCode,
        language,
      );

      // Append AI review to the standard message
      assignment.feedback = `Passed with ${assignment.hintsUsed} hints used.\n\n${aiFeedback}`;
    } catch (error) {
      console.error('AI Review Generation Failed:', error);
      // Fallback message
      assignment.feedback = `Passed with ${assignment.hintsUsed} hints used.`;
    }

    return this.repo.save(assignment);
  }
}
