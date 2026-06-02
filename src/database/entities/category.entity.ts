import { SoftDeleteBaseEntity } from './base.entity';
import {
  Column,
  Entity,
  OneToMany,
  } from 'typeorm';
import { TaskTemplate } from './task-template.entity';

@Entity('categories')
export class Category extends SoftDeleteBaseEntity {
  
  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  color: string;

  @OneToMany(() => TaskTemplate, (template) => template.category)
  taskTemplates: TaskTemplate[];
}
