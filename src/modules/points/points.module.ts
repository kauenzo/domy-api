import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTransaction, User } from '../../database/entities';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PointTransaction])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
