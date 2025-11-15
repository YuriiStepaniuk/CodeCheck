import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TeacherService } from '../teacher/teacher.service';
import { DataSource } from 'typeorm';
import { CreateTeacherByAdminDto } from '../teacher/dto/create-teacher-by-admin.dto';
import { Role } from '../user/types/role.enum';
import { User } from '../user/user.entity';
import { Teacher } from '../teacher/teacher.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly teacherService: TeacherService,
    private readonly dataSource: DataSource,
  ) {}

  async createTeacher(
    dto: CreateTeacherByAdminDto,
  ): Promise<{ user: User; teacher: Teacher }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.create(
        dto,
        queryRunner.manager,
        Role.Teacher,
      );

      const teacher = await this.teacherService.create(
        { userId: user.id },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return { user, teacher };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
