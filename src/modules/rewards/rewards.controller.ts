import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/types/authenticated-request.type';
import { RewardsService } from './rewards.service';

@ApiTags('rewards')
@ApiBearerAuth()
@Controller('rewards')
@UseGuards(AuthGuard('jwt'))
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista recompensas disponíveis (ativas e com estoque)',
  })
  @ApiResponse({
    status: 200,
    description: 'Vitrine de recompensas disponíveis',
  })
  listAvailable() {
    return this.rewardsService.listAvailable();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna os detalhes de uma recompensa disponível' })
  @ApiResponse({ status: 200, description: 'Dados da recompensa' })
  @ApiResponse({
    status: 404,
    description: 'Recompensa não encontrada ou indisponível',
  })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.rewardsService.findAvailableById(id);
  }

  @Post(':id/redeem')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Solicita o resgate de uma recompensa' })
  @ApiResponse({
    status: 201,
    description: 'Resgate solicitado com sucesso, pontos debitados',
  })
  @ApiResponse({
    status: 400,
    description: 'Saldo insuficiente, sem estoque ou cooldown ativo',
  })
  @ApiResponse({ status: 404, description: 'Recompensa não encontrada' })
  redeem(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.rewardsService.redeem(id, user.id);
  }
}
