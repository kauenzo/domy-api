import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redemption, TaskInstance, User } from '../../../database/entities';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, TaskInstance, Redemption])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class AdminDashboardModule {}
