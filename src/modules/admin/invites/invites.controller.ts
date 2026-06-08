import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../../../common/guards/admin.guard';
import type { AuthenticatedRequest } from '../../../common/types/authenticated-request.type';
import { InvitesService } from './invites.service';

@Controller()
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post('admin/invites')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @ApiTags('admin/invites')
  @ApiOperation({ summary: 'Cria um novo convite e retorna o link com token' })
  @ApiResponse({ status: 201, description: 'Convite criado com sucesso' })
  async createInvite(@Req() request: AuthenticatedRequest) {
    return this.invitesService.createInvite(request.user!.id);
  }

  @Get('admin/invites')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @ApiTags('admin/invites')
  @ApiOperation({ summary: 'Lista todos os convites gerados' })
  @ApiResponse({ status: 200, description: 'Lista de convites' })
  async listInvites() {
    return this.invitesService.listInvites();
  }

  @Delete('admin/invites/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @ApiTags('admin/invites')
  @ApiOperation({ summary: 'Invalida um convite existente' })
  @ApiResponse({ status: 200, description: 'Convite invalidado' })
  @ApiResponse({ status: 404, description: 'Convite não encontrado' })
  async invalidateInvite(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true }> {
    await this.invitesService.invalidateInvite(id);
    return { success: true };
  }

  @Get('invites/:token')
  @ApiTags('invites')
  @ApiOperation({ summary: 'Valida um token de convite (público)' })
  @ApiResponse({ status: 200, description: 'Status do convite' })
  @ApiResponse({
    status: 404,
    description: 'Convite não encontrado ou inválido',
  })
  async validateToken(@Param('token') token: string) {
    return this.invitesService.validateToken(token);
  }
}
