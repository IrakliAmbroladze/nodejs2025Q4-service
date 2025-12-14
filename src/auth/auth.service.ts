import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const { login, password } = signupDto;

    const existingUser = await this.userRepository.findOne({
      where: { login },
    });

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const salt = parseInt(process.env.CRYPT_SALT, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const dateNow = Date.now();
    const user = this.userRepository.create({
      login,
      password: hashedPassword,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await this.userRepository.save(user);
    this.loggingService.log(`New user registered: ${login}`, 'AuthService');

    return { message: 'User created successfully' };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { login, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      this.loggingService.warn(
        `Failed login attempt for: ${login}`,
        'AuthService',
      );
      throw new ForbiddenException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.loggingService.warn(
        `Wrong password for user: ${login}`,
        'AuthService',
      );
      throw new ForbiddenException('Invalid login or password');
    }

    const tokens = await this.generateTokens(user.id, user.login);
    this.loggingService.log(`User logged in: ${login}`, 'AuthService');

    return tokens;
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const tokens = await this.generateTokens(payload.userId, payload.login);
      this.loggingService.log(
        `Tokens refreshed for user: ${payload.login}`,
        'AuthService',
      );

      return tokens;
    } catch (error) {
      this.loggingService.warn('Invalid refresh token', 'AuthService');
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(
    userId: string,
    login: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { userId, login };

    const accessTokenExpiry = (process.env.TOKEN_EXPIRE_TIME || '1h') as any;
    const refreshTokenExpiry = (process.env.TOKEN_REFRESH_EXPIRE_TIME ||
      '24h') as any;

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: accessTokenExpiry,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string, login: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, login },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
