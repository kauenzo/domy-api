import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../../common/guards/admin.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../../common/types/authenticated-request.type';
import { AdminRedemptionsService } from './admin-redemptions.service';
import { RejectRedemptionDto } from './dto/reject-redemption.dto';
import { RedemptionStatus } from '../../../database/entities';

@ApiTags('Admin / Resgates')
@Controller('admin/redemptions')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminRedemptionsController {
  constructor(
    private readonly adminRedemptionsService: AdminRedemptionsService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Lista todos os resgates com filtros opcionais de status e usuário',
  })
  @ApiQuery({ name: 'status', required: false, enum: RedemptionStatus })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  findAll(
    @Query('status') status?: RedemptionStatus,
    @Query('userId') userId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminRedemptionsService.findAll({
      status,
      userId,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna os detalhes de um resgate específico' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminRedemptionsService.findById(id);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aprova um resgate pendente' })
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: AuthUser,
  ) {
    return this.adminRedemptionsService.approve(id, admin.id);
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rejeita um resgate pendente e reembolsa os pontos ao membro',
  })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectRedemptionDto,
    @CurrentUser() admin: AuthUser,
  ) {
    return this.adminRedemptionsService.reject(id, admin.id, dto);
  }
}
