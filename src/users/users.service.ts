import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserResponse } from './entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private excludePassword(user: User): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const salt = parseInt(process.env.CRYPT_SALT, 10) || 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const dateNow = Date.now();
    const newUser = this.userRepository.create({
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.excludePassword(savedUser);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const salt = parseInt(process.env.CRYPT_SALT, 10) || 10;
    user.password = await bcrypt.hash(updatePasswordDto.newPassword, salt);
    user.updatedAt = Date.now();

    const updatedUser = await this.userRepository.save(user);
    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
