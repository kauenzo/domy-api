import { SoftDeleteBaseEntity } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  } from 'typeorm';
import { TaskTemplate } from './task-template.entity';
import { User } from './user.entity';

export enum TaskInstanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  OVERDUE = 'overdue',
  SKIPPED = 'skipped',
}

@Entity('task_instances')
export class TaskInstance extends SoftDeleteBaseEntity {

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({ name: 'assigned_to' })
  assignedToId: string;

  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: string;

  @Column({ name: 'deadline_at' })
  deadlineAt: Date;

  @Column({
    type: 'enum',
    enum: TaskInstanceStatus,
    name: 'status',
    default: TaskInstanceStatus.PENDING,
  })
  status: TaskInstanceStatus;

  @Column({ name: 'points_earned', nullable: true })
  pointsEarned: number | null;

  @Column({ name: 'points_penalty', nullable: true })
  pointsPenalty: number | null;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'override_title', nullable: true })
  overrideTitle: string | null;

  @Column({ name: 'override_description', type: 'text', nullable: true })
  overrideDescription: string | null;

  @Column({ name: 'override_deadline_at', nullable: true })
  overrideDeadlineAt: Date | null;

  @Column({ name: 'is_exception', default: false })
  isException: boolean;

  @ManyToOne(() => TaskTemplate, (template) => template.instances)
  @JoinColumn({ name: 'template_id' })
  template: TaskTemplate;

  @ManyToOne(() => User, (user) => user.taskInstances)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;
}
