import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redemption } from '../../database/entities';

@Injectable()
export class RedemptionsService {
  constructor(
    @InjectRepository(Redemption)
    private readonly redemptionRepository: Repository<Redemption>,
  ) {}

  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: Redemption[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.redemptionRepository.findAndCount({
      where: { userId },
      relations: ['reward'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOneByUser(id: string, userId: string): Promise<Redemption> {
    const redemption = await this.redemptionRepository.findOne({
      where: { id, userId },
      relations: ['reward'],
    });

    if (!redemption) throw new NotFoundException('Resgate não encontrado');
    return redemption;
  }
}
