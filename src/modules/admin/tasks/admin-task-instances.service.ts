import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TaskInstance,
  TaskInstanceStatus,
} from '../../../database/entities/task-instance.entity';
import { UpdateTaskInstanceDto } from './dto/update-task-instance.dto';

export interface ListTaskInstancesFilters {
  date?: string;
  status?: TaskInstanceStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminTaskInstancesService {
  constructor(
    @InjectRepository(TaskInstance)
    private readonly taskInstanceRepository: Repository<TaskInstance>,
  ) {}

  /**
   * Lista instâncias paginadas com filtros opcionais por data, status e membro.
   */
  async list(filters: ListTaskInstancesFilters): Promise<{
    data: TaskInstance[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { date, status, userId, page = 1, limit = 20 } = filters;

    const qb = this.taskInstanceRepository
      .createQueryBuilder('ti')
      .leftJoinAndSelect('ti.template', 'template')
      .leftJoinAndSelect('ti.assignedTo', 'assignedTo')
      .where('ti.deleted_at IS NULL');

    if (date) {
      qb.andWhere('ti.scheduled_date = :date', { date });
    }

    if (status) {
      qb.andWhere('ti.status = :status', { status });
    }

    if (userId) {
      qb.andWhere('ti.assigned_to = :userId', { userId });
    }

    qb.orderBy('ti.scheduled_date', 'DESC')
      .addOrderBy('ti.deadline_at', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  /**
   * Retorna o detalhe completo de uma instância (qualquer membro) com relações carregadas.
   */
  async findOne(id: string): Promise<TaskInstance> {
    const instance = await this.taskInstanceRepository.findOne({
      where: { id },
      relations: ['template', 'template.category', 'assignedTo'],
    });

    if (!instance) {
      throw new NotFoundException('Instância de tarefa não encontrada');
    }

    return instance;
  }

  /**
   * Edita campos de override da instância e marca is_exception = true.
   * Não afeta o template nem outras instâncias.
   */
  async update(id: string, dto: UpdateTaskInstanceDto): Promise<TaskInstance> {
    const instance = await this.findOne(id);

    await this.taskInstanceRepository.update(instance.id, {
      ...(dto.overrideTitle !== undefined && {
        overrideTitle: dto.overrideTitle,
      }),
      ...(dto.overrideDescription !== undefined && {
        overrideDescription: dto.overrideDescription,
      }),
      ...(dto.overrideDeadlineAt !== undefined && {
        overrideDeadlineAt: new Date(dto.overrideDeadlineAt),
      }),
      isException: true,
    });

    return this.taskInstanceRepository.findOne({
      where: { id },
      relations: ['template', 'template.category', 'assignedTo'],
    }) as Promise<TaskInstance>;
  }

  /**
   * Soft delete de uma instância avulsa sem afetar o template.
   */
  async softDelete(id: string): Promise<void> {
    await this.findOne(id); // valida existência
    await this.taskInstanceRepository.softDelete(id);
  }
}
