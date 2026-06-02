import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from '../../database/entities';
import { AuthPrincipal, AuthTokens } from './interfaces/auth-session.interface';

const REFRESH_TOKEN_SALT_ROUNDS = 10;

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async issueTokens(user: AuthPrincipal): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      jti: randomUUID(),
      type: 'access',
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        jti: randomUUID(),
        type: 'refresh',
      },
      {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
          '30d') as JwtSignOptions['expiresIn'],
      },
    );

    await this.persistRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    user: AuthPrincipal,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const storedToken = await this.findValidRefreshToken(user.id, refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    storedToken.revokedAt = new Date();
    await this.refreshTokenRepository.save(storedToken);

    return this.issueTokens(user);
  }

  async revokeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const storedToken = await this.findValidRefreshToken(userId, refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    storedToken.revokedAt = new Date();
    await this.refreshTokenRepository.save(storedToken);
  }

  private async persistRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const tokenHash = await bcrypt.hash(
      refreshToken,
      REFRESH_TOKEN_SALT_ROUNDS,
    );
    const decodedToken = this.jwtService.decode(refreshToken);
    const expiresAt = decodedToken?.exp
      ? new Date(decodedToken.exp * 1000)
      : null;

    if (!expiresAt) {
      throw new UnauthorizedException(
        'Nao foi possivel registrar o refresh token',
      );
    }

    await this.refreshTokenRepository.save({
      userId,
      tokenHash,
      expiresAt,
      revokedAt: null,
    });
  }

  private async findValidRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken | null> {
    const tokens = await this.refreshTokenRepository.find({
      where: {
        userId,
        revokedAt: IsNull(),
      },
    });

    for (const token of tokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);

      if (isMatch) {
        return token;
      }
    }

    return null;
  }
}
