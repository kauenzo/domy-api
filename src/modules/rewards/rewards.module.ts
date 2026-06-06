import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PointTransaction,
  Redemption,
  Reward,
  User,
} from '../../database/entities';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, Redemption, PointTransaction, User]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
