import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthSessionService } from './auth-session.service';
import { GoogleProfile } from './interfaces/google-profile.interface';
import { User, UserRole } from '../../database/entities';
import { AuthPrincipal } from './interfaces/auth-session.interface';
import { InvitesService } from '../admin/invites/invites.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly sessionService: AuthSessionService,
    private readonly invitesService: InvitesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(User);
      let userRecord = repository.create({
        email: registerDto.email,
        name: registerDto.name,
        password: passwordHash,
        roles: [UserRole.MEMBER],
        isActive: true,
      });

      userRecord = await repository.save(userRecord);

      if (registerDto.inviteToken) {
        await this.invitesService.useInvite(
          registerDto.inviteToken,
          userRecord.id,
          manager,
        );
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

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const tokens = await this.sessionService.issueTokens(
      this.toPrincipal(user),
    );

    return {
      user: this.toAuthUserDto(user),
      ...tokens,
    };
  }

  async loginWithGoogle(
    profile: GoogleProfile,
    inviteToken?: string,
  ): Promise<AuthResponseDto> {
    if (!profile.email) {
      throw new BadRequestException('Google profile sem email valido');
    }

    const user = await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(User);
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
        await this.invitesService.useInvite(
          inviteToken,
          userRecord.id,
          manager,
        );
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
