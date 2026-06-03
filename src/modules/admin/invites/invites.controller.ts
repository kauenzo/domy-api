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
import { AdminGuard } from '../../../common/guards/admin.guard';
import type { AuthenticatedRequest } from '../../../common/types/authenticated-request.type';
import { InvitesService } from './invites.service';

@Controller()
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post('admin/invites')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async createInvite(@Req() request: AuthenticatedRequest) {
    return this.invitesService.createInvite(request.user!.id);
  }

  @Get('admin/invites')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async listInvites() {
    return this.invitesService.listInvites();
  }

  @Delete('admin/invites/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async invalidateInvite(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true }> {
    await this.invitesService.invalidateInvite(id);
    return { success: true };
  }

  @Get('invites/:token')
  async validateToken(@Param('token') token: string) {
    return this.invitesService.validateToken(token);
  }
}
