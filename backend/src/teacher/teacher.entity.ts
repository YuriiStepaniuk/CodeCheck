import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { StudentTask } from '../assignment/entities/student-task.entity';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Task, (task) => task.teacher)
  createdTasks: Task[];

  @OneToMany(() => StudentTask, (st) => st.assignedBy)
  assignedTasks: StudentTask[];

  @CreateDateColumn()
  joinedAt: Date;
}
