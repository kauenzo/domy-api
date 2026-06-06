import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskInstance } from '../../../database/entities/task-instance.entity';
import { AdminTaskInstancesController } from './admin-task-instances.controller';
import { AdminTaskInstancesService } from './admin-task-instances.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskInstance])],
  controllers: [AdminTaskInstancesController],
  providers: [AdminTaskInstancesService],
})
export class AdminTaskInstancesModule {}
