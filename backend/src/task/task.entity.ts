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
import { TaskDifficulty } from './types/task-difficulty';
import { Language } from './types/language';
import { Group } from '../group/group.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskDifficulty,
    default: TaskDifficulty.MEDIUM,
  })
  difficulty: TaskDifficulty;

  @Column({
    type: 'enum',
    enum: Language,
    default: Language.JS,
  })
  language: Language;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ default: 'solution' })
  entryFunctionName: string;

  @Column({ type: 'json', nullable: true })
  starterCode: Record<string, string> | null;

  @Column({ type: 'json', nullable: false, default: () => "'[]'" })
  testCases: Array<{
    input: any[];
    expectedOutput: any;
  }>;

  @Column({ type: 'json', nullable: false, default: () => "'[]'" })
  hints: Array<{
    id: string; // unique id to track if student opened it
    message: string; // "Try using a for-loop..."
    cost: number; // e.g. 5 points penalty for using this hint
  }>;

  @ManyToOne(() => Teacher, (teacher) => teacher.createdTasks, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE',
  })
  teacher: Teacher;

  @ManyToOne(() => Group, (group) => group.tasks)
  group: Group;

  @OneToMany(() => StudentTask, (st) => st.task)
  studentAssignments: StudentTask[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
