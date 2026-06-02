import { SoftDeleteBaseEntity } from './base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { TaskTemplate } from './task-template.entity';

@Entity('tags')
export class Tag extends SoftDeleteBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => TaskTemplate, (template) => template.tags)
  taskTemplates: TaskTemplate[];
}
