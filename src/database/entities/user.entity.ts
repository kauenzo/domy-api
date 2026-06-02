import { SoftDeleteBaseEntity } from './base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Invite } from './invite.entity';
import { TaskTemplate } from './task-template.entity';
import { TaskInstance } from './task-instance.entity';
import { PointTransaction } from './point-transaction.entity';
import { Redemption } from './redemption.entity';
import { Notification } from './notification.entity';

export enum UserRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

export enum UserLevel {
  BRONZE = 'Bronze',
  PRATA = 'Prata',
  OURO = 'Ouro',
  DIAMANTE = 'Diamante',
}

@Entity('users')
export class User extends SoftDeleteBaseEntity {
  @Column({ name: 'google_id', unique: true })
  googleId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.MEMBER],
    name: 'roles',
  })
  roles: UserRole[];

  @Column({ name: 'points_balance', default: 0 })
  pointsBalance: number;

  @Column({ name: 'current_streak', default: 0 })
  currentStreak: number;

  @Column({ name: 'longest_streak', default: 0 })
  longestStreak: number;

  @Column({
    type: 'enum',
    enum: UserLevel,
    default: UserLevel.BRONZE,
    name: 'level',
  })
  level: UserLevel;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Invite, (invite) => invite.createdBy)
  createdInvites: Invite[];

  @OneToMany(() => Invite, (invite) => invite.usedBy)
  usedInvites: Invite[];

  @OneToMany(() => TaskTemplate, (template) => template.assignedTo)
  taskTemplates: TaskTemplate[];

  @OneToMany(() => TaskInstance, (instance) => instance.assignedTo)
  taskInstances: TaskInstance[];

  @OneToMany(() => PointTransaction, (tx) => tx.user)
  pointTransactions: PointTransaction[];

  @OneToMany(() => Redemption, (redemption) => redemption.user)
  redemptions: Redemption[];

  @OneToMany(() => Redemption, (redemption) => redemption.reviewedBy)
  reviewedRedemptions: Redemption[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
