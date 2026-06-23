import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TaskInstance,
  TaskInstanceStatus,
} from '../../../database/entities/task-instance.entity';
import {
  DeadlineType,
  TaskDifficulty,
  TaskTemplate,
} from '../../../database/entities/task-template.entity';
import { User } from '../../../database/entities/user.entity';
import { CreateTaskInstanceDto } from './dto/create-task-instance.dto';
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
    @InjectRepository(TaskTemplate)
    private readonly taskTemplateRepository: Repository<TaskTemplate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Cria uma nova instância de tarefa vinculada a um template e membro.
   */
  async create(dto: CreateTaskInstanceDto): Promise<TaskInstance> {
    const assignedTo = await this.userRepository.findOne({
      where: { id: dto.assignedToId },
    });
    if (!assignedTo) {
      throw new NotFoundException('Membro atribuído não encontrado');
    }

    let templateId = dto.templateId;

    if (!templateId) {
      // Busca ou cria um template genérico de "Tarefa Avulsa" para este usuário
      let template = await this.taskTemplateRepository.findOne({
        where: { title: 'Tarefa Avulsa', assignedToId: dto.assignedToId },
      });

      if (!template) {
        template = this.taskTemplateRepository.create({
          title: 'Tarefa Avulsa',
          description: 'Template padrão para tarefas avulsas personalizadas',
          assignedToId: dto.assignedToId,
          difficulty: TaskDifficulty.MEDIUM,
          basePoints: 10,
          deadlineType: DeadlineType.END_OF_DAY,
          penaltyPoints: 0,
        });
        template = await this.taskTemplateRepository.save(template);
      }
      templateId = template.id;
    } else {
      // Valida se o template informado existe
      const templateExists = await this.taskTemplateRepository.findOne({
        where: { id: templateId },
      });
      if (!templateExists) {
        throw new NotFoundException('Template de tarefa não encontrado');
      }
    }

    const taskInstance = this.taskInstanceRepository.create({
      templateId,
      assignedToId: dto.assignedToId,
      scheduledDate: dto.scheduledDate,
      deadlineAt: new Date(dto.deadlineAt),
      status: dto.status ?? TaskInstanceStatus.PENDING,
      overrideTitle: dto.overrideTitle ?? null,
      overrideDescription: dto.overrideDescription ?? null,
      overrideDeadlineAt: dto.overrideDeadlineAt
        ? new Date(dto.overrideDeadlineAt)
        : null,
      isException: true, // É uma instância criada manualmente avulsa
    });

    const saved = await this.taskInstanceRepository.save(taskInstance);
    return this.findOne(saved.id);
  }

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
      .where('ti.deletedAt IS NULL');

    if (date) {
      qb.andWhere('ti.scheduledDate = :date', { date });
    }

    if (status) {
      qb.andWhere('ti.status = :status', { status });
    }

    if (userId) {
      qb.andWhere('ti.assignedToId = :userId', { userId });
    }

    qb.orderBy('ti.scheduledDate', 'DESC')
      .addOrderBy('ti.deadlineAt', 'ASC')
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
