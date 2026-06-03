import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken, User } from '../../database/entities';
import { jwtConfig } from '../../config/jwt.config';
import { InvitesModule } from '../admin/invites/invites.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSessionService } from './auth-session.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.register(jwtConfig),
    InvitesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSessionService,
    GoogleStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    ConfigService,
  ],
  exports: [AuthSessionService],
})
export class AuthModule {}
