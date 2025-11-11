import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from '../teacher/teacher.entity';
import { StudentTask } from '../assignment/entities/student-task.entity';

export enum TaskDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TaskDifficulty,
    default: TaskDifficulty.MEDIUM,
  })
  difficulty: TaskDifficulty;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'json', nullable: true })
  starterCode: Record<string, string> | null;

  @Column({ type: 'json', nullable: false, default: () => "'[]'" })
  testCases: Array<{ input: string; expectedOutput: string }>;

  @ManyToOne(() => Teacher, (teacher) => teacher.createdTasks, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  teacher: Teacher;

  @OneToMany(() => StudentTask, (st) => st.task)
  studentAssignments: StudentTask[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
