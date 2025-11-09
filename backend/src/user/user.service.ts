import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '../shared/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (!existingUser) {
      throw new BadRequestException(
        `User with email ${data.email} already exists`,
      );
    }

    const hashedPassword = await this.hashService.hash(data.password);

    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id, 10) },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (data.email && data.email !== user.email) {
      const emailTaken = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (emailTaken) {
        throw new BadRequestException(`Email ${data.email} is already taken`);
      }
    }

    if (data.password) {
      data.password = await this.hashService.hash(data.password);
    }

    Object.assign(user, data);

    return this.userRepository.save(user);
  }

  async delete(id: string) {
    const user = await this.userRepository.findBy({ id: parseInt(id) });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return this.userRepository.delete({ id: parseInt(id) });
  }
}
