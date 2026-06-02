import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TaskTemplate } from './task-template.entity';
import { Tag } from './tag.entity';

/**
 * Tabela de junção entre TaskTemplate e Tag.
 * O relacionamento ManyToMany é gerenciado via @JoinTable em TaskTemplate.
 * Esta entidade existe para consultas diretas à tabela de junção, se necessário.
 */
@Entity('task_template_tags')
export class TaskTemplateTag {
  @PrimaryColumn({ name: 'template_id' })
  templateId: string;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: string;

  @ManyToOne(() => TaskTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: TaskTemplate;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
