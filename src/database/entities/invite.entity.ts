import { BaseEntity } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  } from 'typeorm';
import { User } from './user.entity';

@Entity('invites')
export class Invite extends BaseEntity {

  @Column({ type: 'uuid', unique: true })
  token: string;

  @Column({ name: 'created_by' })
  createdById: string;

  @Column({ name: 'used_by', nullable: true })
  usedById: string | null;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'used_at', nullable: true })
  usedAt: Date | null;

  @ManyToOne(() => User, (user) => user.createdInvites)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.usedInvites, { nullable: true })
  @JoinColumn({ name: 'used_by' })
  usedBy: User | null;
}
