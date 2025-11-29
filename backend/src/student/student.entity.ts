import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { StudentTask } from '../assignment/entities/student-task.entity';
import { Group } from '../group/group.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => StudentTask, (studentTask) => studentTask.student)
  assignedTasks: StudentTask[];

  @ManyToOne(() => Group, (group) => group.students)
  group: Group;

  @CreateDateColumn()
  enrolledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActive: Date | null;
}
