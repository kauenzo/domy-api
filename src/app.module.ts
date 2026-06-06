import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDataSourceOptions } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { AdminAuthModule } from './modules/admin/auth/admin-auth.module';
import { AdminUsersModule } from './modules/admin/users/admin-users.module';
import { AdminRewardsModule } from './modules/admin/rewards/admin-rewards.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { PointsModule } from './modules/points/points.module';
import { AdminRedemptionsModule } from './modules/admin/redemptions/admin-redemptions.module';
import { RedemptionsModule } from './modules/redemptions/redemptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
    TypeOrmModule.forRoot(getDataSourceOptions()),
    AuthModule,
    AdminAuthModule,
    AdminUsersModule,
    AdminRewardsModule,
    RewardsModule,
    PointsModule,
    AdminRedemptionsModule,
    RedemptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
