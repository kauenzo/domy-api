import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/types/authenticated-request.type';
import { PointsService } from './points.service';

@ApiTags('Pontos')
@ApiBearerAuth()
@Controller('points')
@UseGuards(AuthGuard('jwt'))
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Retorna o resumo de gamificação do membro (saldo, streak, nível, total ganho)',
  })
  @ApiResponse({ status: 200, description: 'Resumo de pontos e gamificação' })
  getSummary(@CurrentUser() user: AuthUser) {
    return this.pointsService.getSummary(user.id);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Retorna o histórico paginado de transações de pontos do membro',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Histórico paginado de transações' })
  getHistory(
    @CurrentUser() user: AuthUser,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.pointsService.getHistory(user.id, page, limit);
  }
}
