import { BaseEntity } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  } from 'typeorm';
import { User } from './user.entity';

export enum PointTransactionType {
  TASK_COMPLETION = 'task_completion',
  STREAK_BONUS = 'streak_bonus',
  PENALTY = 'penalty',
  REDEMPTION_DEBIT = 'redemption_debit',
  REDEMPTION_REFUND = 'redemption_refund',
  MANUAL_ADJUSTMENT = 'manual_adjustment',
}

@Entity('point_transactions')
export class PointTransaction extends BaseEntity {

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: PointTransactionType, name: 'type' })
  type: PointTransactionType;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.pointTransactions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
