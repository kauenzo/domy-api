import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  REDEMPTION_APPROVED = 'redemption_approved',
  REDEMPTION_REJECTED = 'redemption_rejected',
  TASK_OVERDUE = 'task_overdue',
  STREAK_MILESTONE = 'streak_milestone',
  LEVEL_UP = 'level_up',
  GENERAL = 'general',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType, name: 'type' })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}

