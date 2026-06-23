import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity';

@Entity('invites')
export class Invite extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  token: string;

  @Column({ name: 'created_by' })
  createdById: string;

  @Column({ name: 'used_by', type: 'uuid', nullable: true })
  usedById: string | null;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  usedAt: Date | null;

  @ManyToOne(() => User, (user) => user.createdInvites)
  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (user) => user.usedInvites, { nullable: true })
  @JoinColumn({ name: 'used_by' })
  usedBy: Relation<User> | null;
}
