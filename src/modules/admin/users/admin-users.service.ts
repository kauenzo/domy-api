import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  PointTransaction,
  PointTransactionType,
  User,
} from '../../../database/entities';
import { AdjustPointsDto } from './dto/adjust-points.dto';
import { AdminUserDto, PaginatedUsersResponseDto } from './dto/admin-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async listUsers(
    query: ListUsersQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.userRepository.createQueryBuilder('user');

    if (query.search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.role) {
      qb.andWhere(':role = ANY(user.roles)', { role: query.role });
    }

    if (query.isActive !== undefined) {
      qb.andWhere('user.is_active = :isActive', { isActive: query.isActive });
    }

    qb.orderBy('user.created_at', 'DESC').skip(skip).take(limit);

    const [users, total] = await qb.getManyAndCount();

    return {
      items: users.map((user) => this.toAdminUserDto(user)),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<AdminUserDto> {
    const user = await this.findUserOrThrow(id);
    return this.toAdminUserDto(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<AdminUserDto> {
    const user = await this.findUserOrThrow(id);

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    if (dto.roles !== undefined) {
      user.roles = dto.roles;
    }

    if (dto.isActive !== undefined) {
      user.isActive = dto.isActive;
    }

    const saved = await this.userRepository.save(user);
    return this.toAdminUserDto(saved);
  }

  async softDeleteUser(id: string): Promise<void> {
    await this.findUserOrThrow(id);
    await this.userRepository.softDelete(id);
  }

  async adjustPoints(id: string, dto: AdjustPointsDto): Promise<AdminUserDto> {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const pointTransactionRepository =
        manager.getRepository(PointTransaction);

      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('Usuario nao encontrado');
      }

      const newBalance = user.pointsBalance + dto.amount;

      if (newBalance < 0) {
        throw new BadRequestException(
          'Saldo de pontos nao pode ficar negativo',
        );
      }

      user.pointsBalance = newBalance;
      await userRepository.save(user);

      await pointTransactionRepository.save(
        pointTransactionRepository.create({
          userId: user.id,
          amount: dto.amount,
          type: PointTransactionType.MANUAL_ADJUSTMENT,
          referenceId: null,
          description: dto.description,
        }),
      );

      return this.toAdminUserDto(user);
    });
  }

  private async findUserOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }

  private toAdminUserDto(user: User): AdminUserDto {
    return {
      id: user.id,
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      pointsBalance: user.pointsBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      level: user.level,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
