import { SoftDeleteBaseEntity } from './base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Redemption } from './redemption.entity';

@Entity('rewards')
export class Reward extends SoftDeleteBaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'cover_image_url', type: 'varchar', nullable: true })
  coverImageUrl: string | null;

  @Column({ name: 'points_cost' })
  pointsCost: number;

  @Column({ name: 'stock_limit', type: 'int', nullable: true })
  stockLimit: number | null;

  @Column({ name: 'stock_used', default: 0 })
  stockUsed: number;

  @Column({ name: 'cooldown_days', type: 'int', nullable: true })
  cooldownDays: number | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Redemption, (redemption) => redemption.reward)
  redemptions: Redemption[];
}
