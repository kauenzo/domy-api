import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { PointTransaction } from '../../database/entities/point-transaction.entity';
import { GamificationService } from './gamification.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PointTransaction])],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
