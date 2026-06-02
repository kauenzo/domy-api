import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthSessionService } from './auth-session.service';
import { GoogleProfile } from './interfaces/google-profile.interface';
import { Invite, User, UserRole } from '../../database/entities';
import { AuthPrincipal } from './interfaces/auth-session.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly sessionService: AuthSessionService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async loginWithGoogle(
    profile: GoogleProfile,
    inviteToken?: string,
  ): Promise<AuthResponseDto> {
    if (!profile.email) {
      throw new BadRequestException('Google profile sem email valido');
    }

    const user = await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(User);
      const inviteManager = manager.getRepository(Invite);
      let userRecord = await repository.findOne({
        where: [{ googleId: profile.id }, { email: profile.email }],
      });

      if (!userRecord) {
        userRecord = repository.create({
          googleId: profile.id,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          roles: [UserRole.MEMBER],
          isActive: true,
        });
      } else {
        userRecord.googleId = profile.id;
        userRecord.email = profile.email;
        userRecord.name = profile.name;
        userRecord.avatarUrl = profile.avatarUrl;
      }

      userRecord = await repository.save(userRecord);

      if (inviteToken) {
        await this.consumeInvite(inviteManager, inviteToken, userRecord.id);
      }

      return userRecord;
    });

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
    const user = await this.findUserOrThrow(userId);
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

  async me(userId: string): Promise<AuthUserDto> {
    const user = await this.findUserOrThrow(userId);
    return this.toAuthUserDto(user);
  }

  private async findUserOrThrow(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }

  private async consumeInvite(
    inviteRepository: Repository<Invite>,
    inviteToken: string,
    usedById: string,
  ): Promise<void> {
    const invite = await inviteRepository.findOne({
      where: {
        token: inviteToken,
      },
    });

    if (!invite) {
      throw new BadRequestException('Convite invalido');
    }

    const now = new Date();
    if (invite.usedAt || invite.expiresAt.getTime() <= now.getTime()) {
      throw new BadRequestException('Convite invalido');
    }

    invite.usedById = usedById;
    invite.usedAt = now;
    await inviteRepository.save(invite);
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
