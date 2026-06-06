import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import {
  PointTransaction,
  PointTransactionType,
  TaskInstance,
  TaskInstanceStatus,
  TaskTemplate,
  User,
} from '../../database/entities';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskInstance)
    private readonly taskInstanceRepository: Repository<TaskInstance>,

    @InjectRepository(TaskTemplate)
    private readonly taskTemplateRepository: Repository<TaskTemplate>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,

    private readonly gamificationService: GamificationService,
  ) {}

  /**
   * Retorna as task_instances do membro para a data especificada.
   * Se `date` não for informado, usa a data de hoje no fuso UTC-3 (América/São Paulo).
   */
  async findByDate(userId: string, date?: string): Promise<TaskInstance[]> {
    const scheduledDate = date ?? this.getTodayBR();

    return this.taskInstanceRepository.find({
      where: { assignedToId: userId, scheduledDate },
      relations: ['template', 'template.category'],
      order: { deadlineAt: 'ASC' },
    });
  }

  /**
   * Retorna o detalhe de uma instância verificando ownership.
   * Lança 403 se a instância pertence a outro membro.
   */
  async findOne(userId: string, instanceId: string): Promise<TaskInstance> {
    const instance = await this.taskInstanceRepository.findOne({
      where: { id: instanceId },
      relations: ['template', 'template.category'],
    });

    if (!instance) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (instance.assignedToId !== userId) {
      throw new ForbiddenException('Acesso negado a esta tarefa');
    }

    return instance;
  }

  /**
   * Transição pending → in_progress. Idempotente para status já em in_progress.
   * Valida ownership antes de alterar.
   */
  async start(userId: string, instanceId: string): Promise<TaskInstance> {
    const instance = await this.findOne(userId, instanceId);

    if (instance.status === TaskInstanceStatus.IN_PROGRESS) {
      return instance;
    }

    if (instance.status !== TaskInstanceStatus.PENDING) {
      throw new BadRequestException(
        `Não é possível iniciar uma tarefa com status: ${instance.status}`,
      );
    }

    await this.taskInstanceRepository.update(instanceId, {
      status: TaskInstanceStatus.IN_PROGRESS,
    });

    return this.taskInstanceRepository.findOne({
      where: { id: instanceId },
      relations: ['template', 'template.category'],
    }) as Promise<TaskInstance>;
  }

  /**
   * Conclui uma tarefa e executa o fluxo completo de gamificação:
   *  1. Valida ownership e que ainda não está concluída.
   *  2. Calcula effective_points e points_earned com bônus de streak.
   *  3. Em transação atômica: atualiza instância, cria point_transaction, incrementa saldo.
   *  4. Verifica se todas as tarefas do dia estão done → incrementa streak + atualiza nível.
   */
  async complete(userId: string, instanceId: string): Promise<TaskInstance> {
    // Carrega instância e valida ownership
    const instance = await this.findOne(userId, instanceId);

    if (instance.status === TaskInstanceStatus.DONE) {
      throw new BadRequestException('Esta tarefa já foi concluída');
    }

    if (
      instance.status !== TaskInstanceStatus.PENDING &&
      instance.status !== TaskInstanceStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        `Não é possível concluir uma tarefa com status: ${instance.status}`,
      );
    }

    // Carrega template para calcular pontos (com eager não disponível, busca explícita)
    const template = await this.taskTemplateRepository.findOneOrFail({
      where: { id: instance.templateId },
    });

    // Carrega usuário para obter o streak atual
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    // Calcula pontos
    const effectivePoints = template.pointsOverride ?? template.basePoints;
    const streakMultiplier = this.gamificationService.calculateStreakBonus(
      user.currentStreak,
    );
    const pointsEarned = Math.floor(effectivePoints * streakMultiplier);

    // Transação atômica: instância + point_transaction + points_balance
    await this.dataSource.transaction(async (manager) => {
      const instanceRepo = manager.getRepository(TaskInstance);
      const userRepo = manager.getRepository(User);
      const pointTxRepo = manager.getRepository(PointTransaction);

      // 1. Atualiza instância
      await instanceRepo.update(instanceId, {
        status: TaskInstanceStatus.DONE,
        completedAt: new Date(),
        pointsEarned,
      });

      // 2. Cria point_transaction
      await pointTxRepo.save(
        pointTxRepo.create({
          userId,
          amount: pointsEarned,
          type: PointTransactionType.TASK_COMPLETION,
          referenceId: instanceId,
          description: `Tarefa concluída: ${template.title}`,
        }),
      );

      // 3. Incrementa saldo
      await userRepo.increment({ id: userId }, 'pointsBalance', pointsEarned);
    });

    // Fora da transação: checa streak (leve inconsistência aceitável no MVP)
    const allDoneForToday = await this.allTasksDoneForToday(
      userId,
      instance.scheduledDate,
    );
    if (allDoneForToday) {
      await this.gamificationService.incrementStreak(userId);
      await this.gamificationService.checkAndUpdateLevel(userId);
    }

    return this.taskInstanceRepository.findOne({
      where: { id: instanceId },
      relations: ['template', 'template.category'],
    }) as Promise<TaskInstance>;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Retorna a data de hoje no fuso horário do Brasil (UTC-3) como string YYYY-MM-DD.
   */
  private getTodayBR(): string {
    const now = new Date();
    // Ajusta para UTC-3
    const br = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    return br.toISOString().slice(0, 10);
  }

  /**
   * Verifica se todas as instâncias não-skipped do membro para a data informada
   * estão com status = done. Retorna true somente se não houver nenhuma pending/in_progress.
   */
  private async allTasksDoneForToday(
    userId: string,
    scheduledDate: string,
  ): Promise<boolean> {
    const pendingCount = await this.taskInstanceRepository.count({
      where: {
        assignedToId: userId,
        scheduledDate,
        status: In([
          TaskInstanceStatus.PENDING,
          TaskInstanceStatus.IN_PROGRESS,
        ]),
      },
    });

    return pendingCount === 0;
  }
}
