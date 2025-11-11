import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../student/student.entity';
import { Task } from '../../task/task.entity';
import { Teacher } from '../../teacher/teacher.entity';

export enum AssignmentStatus {
  ASSIGNED = 'ASSIGNED',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
}

@Entity('student_task')
export class StudentTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.assignedTasks, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @ManyToOne(() => Task, { eager: true, onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignedTasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  assignedBy: Teacher;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.ASSIGNED,
  })
  status: AssignmentStatus;

  @Column({ type: 'float', nullable: true })
  grade: number | null;

  @Column({ type: 'text', nullable: true })
  feedback: string | null;

  @CreateDateColumn()
  assignedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
