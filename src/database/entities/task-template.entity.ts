import { SoftDeleteBaseEntity } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { TaskInstance } from './task-instance.entity';

export enum TaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EPIC = 'epic',
}

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export enum DeadlineType {
  END_OF_DAY = 'end_of_day',
  SPECIFIC_TIME = 'specific_time',
  SPECIFIC_DATE = 'specific_date',
}

@Entity('task_templates')
export class TaskTemplate extends SoftDeleteBaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'cover_image_url', type: 'varchar', nullable: true })
  coverImageUrl: string | null;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ name: 'assigned_to' })
  assignedToId: string;

  @Column({ type: 'enum', enum: TaskDifficulty, name: 'difficulty' })
  difficulty: TaskDifficulty;

  @Column({ name: 'base_points' })
  basePoints: number;

  @Column({ name: 'points_override', type: 'int', nullable: true })
  pointsOverride: number | null;

  @Column({
    type: 'enum',
    enum: RecurrenceType,
    name: 'recurrence_type',
    default: RecurrenceType.NONE,
  })
  recurrenceType: RecurrenceType;

  @Column({ name: 'recurrence_config', type: 'jsonb', nullable: true })
  recurrenceConfig: Record<string, unknown> | null;

  @Column({ type: 'enum', enum: DeadlineType, name: 'deadline_type' })
  deadlineType: DeadlineType;

  @Column({ name: 'deadline_value', type: 'varchar', nullable: true })
  deadlineValue: string | null;

  @Column({ name: 'penalty_points', default: 0 })
  penaltyPoints: number;

  @Column({ name: 'is_paused', default: false })
  isPaused: boolean;

  @Column({ name: 'paused_until', type: 'timestamp', nullable: true })
  pausedUntil: Date | null;

  @ManyToOne(() => Category, (category) => category.taskTemplates, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @ManyToOne(() => User, (user) => user.taskTemplates)
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @ManyToMany(() => Tag, (tag) => tag.taskTemplates)
  @JoinTable({
    name: 'task_template_tags',
    joinColumn: { name: 'template_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(() => TaskInstance, (instance) => instance.template)
  instances: TaskInstance[];
}
