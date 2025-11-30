import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User, UserResponse } from './entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  private excludePassword(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const newUser: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.db.users.push(newUser);
    return this.excludePassword(newUser);
  }

  async findAll(): Promise<UserResponse[]> {
    return this.db.users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = this.db.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const userIndex = this.db.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    const user = this.db.users[userIndex];
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    this.db.users[userIndex] = user;
    return this.excludePassword(user);
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.db.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.db.users.splice(userIndex, 1);
  }
}
