import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '../shared/hash/hash.service';
import { Role } from './types/role.enum';
import { ChangePasswordDto } from '../teacher/dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(
    data: CreateUserDto,
    manager?: EntityManager,
    role: Role = Role.Student,
  ): Promise<User> {
    const repository = manager
      ? manager.getRepository(User)
      : this.userRepository;

    const existingUser = await repository.findOneBy({
      email: data.email,
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with email ${data.email} already exists`,
      );
    }

    const hashedPassword = await this.hashService.hash(data.password);

    const newUser = repository.create({
      ...data,
      password: hashedPassword,
      role,
    });

    return repository.save(newUser);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
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
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return this.userRepository.delete(id);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await this.hashService.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await this.hashService.hash(dto.newPassword);
    await this.userRepository.update(user.id, { password: hashedPassword });
  }
}
