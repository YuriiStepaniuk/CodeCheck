import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TeacherService } from '../teacher/teacher.service';
import { DataSource } from 'typeorm';
import { CreateTeacherByAdminDto } from '../teacher/dto/create-teacher-by-admin.dto';
import { Role } from '../user/types/role.enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly teacherService: TeacherService,
    private readonly dataSource: DataSource,
  ) {}

  async createTeacher(dto: CreateTeacherByAdminDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.create(
        dto,
        queryRunner.manager,
        Role.Teacher,
      );

      await this.teacherService.create({ userId: user.id });

      await queryRunner.commitTransaction();

      return user;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
