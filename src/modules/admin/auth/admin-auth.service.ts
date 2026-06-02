import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthResponseDto } from '../../auth/dto/auth-response.dto';
import { AuthUserDto } from '../../auth/dto/auth-user.dto';
import { AuthSessionService } from '../../auth/auth-session.service';
import { AuthPrincipal } from '../../auth/interfaces/auth-session.interface';
import { GoogleAdminProfile } from './interfaces/google-admin-profile.interface';
import { User, UserRole } from '../../../database/entities';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly sessionService: AuthSessionService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async loginWithGoogle(profile: GoogleAdminProfile): Promise<AuthResponseDto> {
    if (!profile.email) {
      throw new NotFoundException('Usuario admin nao encontrado');
    }

    const user = await this.findUser(profile);
    this.assertAdminRole(user);

    const tokens = await this.sessionService.issueTokens(
      this.toPrincipal(user),
    );

    return {
      user: this.toAuthUserDto(user),
      ...tokens,
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponseDto> {
    const user = await this.findUserById(userId);
    this.assertAdminRole(user);

    const tokens = await this.sessionService.refreshTokens(
      this.toPrincipal(user),
      refreshToken,
    );

    return {
      user: this.toAuthUserDto(user),
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.sessionService.revokeRefreshToken(userId, refreshToken);
  }

  private async findUser(profile: GoogleAdminProfile): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ googleId: profile.id }, { email: profile.email }],
    });

    if (!user) {
      throw new ForbiddenException('Usuario nao possui acesso de admin');
    }

    return user;
  }

  private async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }

  private assertAdminRole(user: User): void {
    if (!user.roles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException('Usuario nao possui acesso de admin');
    }
  }

  private toPrincipal(user: User): AuthPrincipal {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
  }

  private toAuthUserDto(user: User): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      pointsBalance: user.pointsBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      level: user.level,
      isActive: user.isActive,
    };
  }
}
