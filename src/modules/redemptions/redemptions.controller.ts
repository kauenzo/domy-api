import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/types/authenticated-request.type';
import { RedemptionsService } from './redemptions.service';

@ApiTags('redemptions')
@ApiBearerAuth()
@Controller('redemptions')
@UseGuards(AuthGuard('jwt'))
export class RedemptionsController {
  constructor(private readonly redemptionsService: RedemptionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista o histórico de resgates do membro autenticado',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Histórico paginado de resgates do membro',
  })
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.redemptionsService.findAllByUser(user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna os detalhes de um resgate específico do membro',
  })
  @ApiResponse({ status: 200, description: 'Dados do resgate' })
  @ApiResponse({ status: 404, description: 'Resgate não encontrado' })
  findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.redemptionsService.findOneByUser(id, user.id);
  }
}
