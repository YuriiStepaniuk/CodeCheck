import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(data: CreateUserDto) {
    const user = this.userService.create(data);

    return user;
  }

  async login() {}

  async logout() {}
}
