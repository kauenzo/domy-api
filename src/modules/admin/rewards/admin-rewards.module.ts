import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from '../../../database/entities';
import { AdminRewardsController } from './admin-rewards.controller';
import { AdminRewardsService } from './admin-rewards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  controllers: [AdminRewardsController],
  providers: [AdminRewardsService],
})
export class AdminRewardsModule {}
