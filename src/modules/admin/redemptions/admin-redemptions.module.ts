import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Notification,
  PointTransaction,
  Redemption,
  Reward,
  User,
} from '../../../database/entities';
import { AdminRedemptionsController } from './admin-redemptions.controller';
import { AdminRedemptionsService } from './admin-redemptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Redemption,
      Reward,
      User,
      PointTransaction,
      Notification,
    ]),
  ],
  controllers: [AdminRedemptionsController],
  providers: [AdminRedemptionsService],
})
export class AdminRedemptionsModule {}
