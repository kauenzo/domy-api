import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PointTransaction,
  TaskInstance,
  TaskTemplate,
  User,
} from '../../database/entities';
import { GamificationModule } from '../gamification/gamification.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskInstance,
      TaskTemplate,
      User,
      PointTransaction,
    ]),
    GamificationModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
