import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../database/entities';
import { AuthModule } from '../../auth/auth.module';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { GoogleAdminStrategy } from './strategies/google-admin.strategy';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, GoogleAdminStrategy],
})
export class AdminAuthModule {}
