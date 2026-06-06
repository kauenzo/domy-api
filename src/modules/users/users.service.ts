import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TaskInstance,
  TaskInstanceStatus,
  User,
} from '../../database/entities';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface ProfileWithStats {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  pointsBalance: number;
  currentStreak: number;
  longestStreak: number;
  level: string;
  totalTasksCompleted: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TaskInstance)
    private readonly taskInstanceRepository: Repository<TaskInstance>,
  ) {}

  async getProfileWithStats(userId: string): Promise<ProfileWithStats> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const totalTasksCompleted = await this.taskInstanceRepository.count({
      where: { assignedToId: userId, status: TaskInstanceStatus.DONE },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      pointsBalance: user.pointsBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      level: user.level,
      totalTasksCompleted,
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileWithStats> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    if (dto.avatarUrl !== undefined) {
      user.avatarUrl = dto.avatarUrl;
    }

    await this.userRepository.save(user);

    return this.getProfileWithStats(userId);
  }
}
