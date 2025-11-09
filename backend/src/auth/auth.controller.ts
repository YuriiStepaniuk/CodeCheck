import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: CreateUserDto) {
    const user = await this.authService.register(registerData);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
