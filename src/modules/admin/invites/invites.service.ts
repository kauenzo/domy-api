import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { EntityManager, Repository } from 'typeorm';
import { Invite } from '../../../database/entities';
import { CreateInviteResponseDto } from './dto/create-invite-response.dto';
import { InviteDto, InviteStatus } from './dto/invite.dto';
import { InviteValidationResponseDto } from './dto/invite-validation-response.dto';

const INVITE_TTL_MS = 48 * 60 * 60 * 1000;
const DEFAULT_BASE_URL = 'http://localhost:3001';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  async createInvite(createdById: string): Promise<CreateInviteResponseDto> {
    const invite = await this.inviteRepository.save(
      this.inviteRepository.create({
        token: randomUUID(),
        createdById,
        usedById: null,
        usedAt: null,
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      }),
    );

    return {
      link: this.buildInviteLink(invite.token),
      invite: this.toInviteDto(invite),
    };
  }

  async listInvites(): Promise<InviteDto[]> {
    const invites = await this.inviteRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return invites.map((invite) => this.toInviteDto(invite));
  }

  async invalidateInvite(id: string): Promise<void> {
    const invite = await this.inviteRepository.findOne({
      where: {
        id,
      },
    });

    if (!invite) {
      throw new NotFoundException('Convite nao encontrado');
    }

    await this.inviteRepository.delete(id);
  }

  async validateToken(token: string): Promise<InviteValidationResponseDto> {
    const invite = await this.inviteRepository.findOne({
      where: {
        token,
      },
    });

    if (!invite) {
      return {
        token,
        isValid: false,
        status: 'invalid',
        expiresAt: null,
        usedAt: null,
      };
    }

    const status = this.getInviteStatus(invite);

    return {
      token,
      isValid: status === 'active',
      status,
      expiresAt: invite.expiresAt,
      usedAt: invite.usedAt,
    };
  }

  async useInvite(
    token: string,
    usedById: string,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = this.getRepository(manager);
    const invite = await repository.findOne({
      where: {
        token,
      },
    });

    if (!invite || this.getInviteStatus(invite) !== 'active') {
      throw new BadRequestException('Convite invalido');
    }

    invite.usedById = usedById;
    invite.usedAt = new Date();
    await repository.save(invite);
  }

  private getRepository(manager?: EntityManager): Repository<Invite> {
    return manager ? manager.getRepository(Invite) : this.inviteRepository;
  }

  private getInviteStatus(invite: Invite): InviteStatus {
    if (invite.usedAt) {
      return 'used';
    }

    if (invite.expiresAt.getTime() <= Date.now()) {
      return 'expired';
    }

    return 'active';
  }

  private toInviteDto(invite: Invite): InviteDto {
    return {
      id: invite.id,
      token: invite.token,
      createdById: invite.createdById,
      usedById: invite.usedById,
      expiresAt: invite.expiresAt,
      usedAt: invite.usedAt,
      status: this.getInviteStatus(invite),
      link: this.buildInviteLink(invite.token),
    };
  }

  private buildInviteLink(token: string): string {
    const baseUrl = process.env.APP_URL ?? DEFAULT_BASE_URL;
    return new URL(`/invites/${token}`, baseUrl).toString();
  }
}
