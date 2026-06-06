import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redemption } from '../../database/entities';
import { RedemptionsController } from './redemptions.controller';
import { RedemptionsService } from './redemptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Redemption])],
  controllers: [RedemptionsController],
  providers: [RedemptionsService],
})
export class RedemptionsModule {}
