import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { HashService } from '../../shared/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../../student/student.service';
import { DataSource } from 'typeorm';
import { TokenName } from '../../shared/enums/token-names';
import { NodeEnv } from '../../shared/enums/node-env.enum';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
  ) {}

  async register(data: CreateUserDto, res: Response) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.create(data, queryRunner.manager);

      await this.studentService.create(
        { userId: user.id },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      res.cookie(TokenName.Access, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === NodeEnv.Production,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
      });

      return { user };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    res.cookie(TokenName.Access, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NodeEnv.Production,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { user };
  }

  async logout(res: Response) {
    res.clearCookie(TokenName.Access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === NodeEnv.Production,
      sameSite: 'strict',
    });

    await Promise.resolve();
    return { message: 'Logged out successfully' };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
