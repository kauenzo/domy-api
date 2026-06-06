import { TaskInstanceStatus } from '../../../database/entities/task-instance.entity';

export class TaskTemplateBasicDto {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  difficulty: string;
  basePoints: number;
  pointsOverride: number | null;
  penaltyPoints: number;
}

export class TaskInstanceResponseDto {
  id: string;
  scheduledDate: string;
  deadlineAt: Date;
  status: TaskInstanceStatus;
  pointsEarned: number | null;
  pointsPenalty: number | null;
  completedAt: Date | null;
  overrideTitle: string | null;
  overrideDescription: string | null;
  overrideDeadlineAt: Date | null;
  isException: boolean;
  template: TaskTemplateBasicDto;
}
