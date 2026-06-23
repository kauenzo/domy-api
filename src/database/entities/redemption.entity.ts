import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity';
import { Reward } from './reward.entity';

export enum RedemptionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('redemptions')
export class Redemption extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'reward_id' })
  rewardId: string;

  @Column({ name: 'points_cost' })
  pointsCost: number;

  @Column({
    type: 'enum',
    enum: RedemptionStatus,
    name: 'status',
    default: RedemptionStatus.PENDING,
  })
  status: RedemptionStatus;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedById: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @Column({ name: 'rejection_reason', type: 'varchar', nullable: true })
  rejectionReason: string | null;

  @ManyToOne(() => User, (user) => user.redemptions)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Reward, (reward) => reward.redemptions)
  @JoinColumn({ name: 'reward_id' })
  reward: Reward;

  @ManyToOne(() => User, (user) => user.reviewedRedemptions, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewedBy: Relation<User> | null;
}

