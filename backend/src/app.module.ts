import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { HashModule } from './shared/hash/hash.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { TaskModule } from './task/task.module';
import { AssignmentModule } from './assignment/assignment.module';
import { AdminModule } from './admin/admin.module';
import { CodeModule } from './shared/code/code.module';
import { AiModule } from './shared/ai/ai.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidation,
    }),
    DatabaseModule,
    UserModule,
    HashModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    TaskModule,
    AssignmentModule,
    AdminModule,
    CodeModule,
    AiModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
