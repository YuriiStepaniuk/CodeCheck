import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Task } from '../task/task.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  inviteCode: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.groups)
  teacher: Teacher;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];

  @OneToMany(() => Task, (task) => task.group)
  tasks: Task[];

  @BeforeInsert()
  generateInviteCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.inviteCode = result;
  }
}
