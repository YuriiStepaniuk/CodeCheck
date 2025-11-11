import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() registerData: CreateUserDto,
  ) {
    const { user } = await this.authService.register(registerData, res);

    return {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginData: LoginUserDto,
  ) {
    const { user } = await this.authService.login(
      loginData.email,
      loginData.password,
      res,
    );

    return {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
    return { message: 'Logged out successfully' };
  }
}
