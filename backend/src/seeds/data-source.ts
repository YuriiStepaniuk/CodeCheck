import 'reflect-metadata';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Task } from '../task/task.entity';
import { StudentTask } from '../assignment/entities/student-task.entity';
import { Admin } from '../admin/admin.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // false in production
  logging: false,
  entities: [User, Admin, Student, Teacher, Task, StudentTask],
});
