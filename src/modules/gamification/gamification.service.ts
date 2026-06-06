import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserLevel } from '../../database/entities/user.entity';
import {
  PointTransaction,
  PointTransactionType,
} from '../../database/entities/point-transaction.entity';

/**
 * Tipos de transação que representam ganho de pontos (não gastos nem penalidades).
 */
const EARNING_TYPES: PointTransactionType[] = [
  PointTransactionType.TASK_COMPLETION,
  PointTransactionType.STREAK_BONUS,
  PointTransactionType.MANUAL_ADJUSTMENT,
];

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
  ) {}

  /**
   * Calcula o multiplicador de bônus com base no streak atual do usuário.
   *
   * Tabela:
   *  - 0–2 dias  → 1.0 (sem bônus)
   *  - 3–6 dias  → 1.1 (+10%)
   *  - 7–13 dias → 1.25 (+25%)
   *  - 14–29 dias→ 1.5 (+50%)
   *  - 30+ dias  → 2.0 (+100%)
   */
  calculateStreakBonus(streak: number): number {
    if (streak >= 30) return 2.0;
    if (streak >= 14) return 1.5;
    if (streak >= 7) return 1.25;
    if (streak >= 3) return 1.1;
    return 1.0;
  }

  /**
   * Determina o nível do usuário com base no total histórico de pontos ganhos.
   *
   * Tabela:
   *  - 0–499     → Bronze
   *  - 500–1999  → Prata
   *  - 2000–4999 → Ouro
   *  - 5000+     → Diamante
   */
  calculateLevel(totalPoints: number): UserLevel {
    if (totalPoints >= 5000) return UserLevel.DIAMANTE;
    if (totalPoints >= 2000) return UserLevel.OURO;
    if (totalPoints >= 500) return UserLevel.PRATA;
    return UserLevel.BRONZE;
  }

  /**
   * Calcula o total histórico de pontos ganhos pelo usuário (apenas transações positivas
   * de tipos considerados como ganho: task_completion, streak_bonus e manual_adjustment positivos).
   */
  private async getTotalEarnedPoints(userId: string): Promise<number> {
    const result = await this.pointTransactionRepository
      .createQueryBuilder('pt')
      .select('COALESCE(SUM(pt.amount), 0)', 'total')
      .where('pt.user_id = :userId', { userId })
      .andWhere('pt.amount > 0')
      .andWhere('pt.type IN (:...types)', { types: EARNING_TYPES })
      .getRawOne<{ total: string }>();

    return parseInt(result?.total ?? '0', 10);
  }

  /**
   * Verifica se o nível calculado diverge do nível armazenado no perfil.
   * Se subiu de nível, atualiza o banco.
   *
   * Nota: a integração com NotificationsModule (level_up) será adicionada
   * quando a Fase 17 estiver implementada.
   */
  async checkAndUpdateLevel(userId: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const totalEarned = await this.getTotalEarnedPoints(userId);
    const newLevel = this.calculateLevel(totalEarned);

    if (newLevel !== user.level) {
      this.logger.log(
        `Usuário ${userId} subiu de nível: ${user.level} → ${newLevel} (pontos ganhos: ${totalEarned})`,
      );

      await this.userRepository.update(userId, { level: newLevel });

      // TODO (Fase 17): injetar NotificationsService e criar notificação do tipo level_up aqui.
    }
  }

  /**
   * Incrementa o streak atual do usuário em +1 e atualiza o longest_streak
   * caso o novo valor seja maior que o recorde anterior.
   */
  async incrementStreak(userId: string): Promise<void> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const newStreak = user.currentStreak + 1;
    const newLongest = Math.max(user.longestStreak, newStreak);

    await this.userRepository.update(userId, {
      currentStreak: newStreak,
      longestStreak: newLongest,
    });

    this.logger.debug(
      `Streak incrementado para usuário ${userId}: ${user.currentStreak} → ${newStreak}` +
        (newLongest > user.longestStreak
          ? ` (novo recorde: ${newLongest})`
          : ''),
    );
  }

  /**
   * Zera o streak atual do usuário (chamado pelo cron noturno quando o usuário
   * não completou todas as tarefas do dia).
   * O longest_streak NÃO é alterado.
   */
  async resetStreak(userId: string): Promise<void> {
    await this.userRepository.update(userId, { currentStreak: 0 });
    this.logger.debug(`Streak zerado para usuário ${userId}`);
  }
}
