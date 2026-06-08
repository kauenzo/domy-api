import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { AdminGuard } from '../../../common/guards/admin.guard';
import { AdminRewardsService } from './admin-rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@ApiTags('admin/rewards')
@ApiBearerAuth()
@Controller('admin/rewards')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminRewardsController {
  constructor(private readonly adminRewardsService: AdminRewardsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as recompensas (admin)' })
  @ApiResponse({ status: 200, description: 'Lista de recompensas' })
  list() {
    return this.adminRewardsService.list();
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova recompensa' })
  @ApiResponse({ status: 201, description: 'Recompensa criada' })
  create(@Body() dto: CreateRewardDto) {
    return this.adminRewardsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna os detalhes de uma recompensa' })
  @ApiResponse({ status: 200, description: 'Dados da recompensa' })
  @ApiResponse({ status: 404, description: 'Recompensa não encontrada' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminRewardsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma recompensa existente' })
  @ApiResponse({ status: 200, description: 'Recompensa atualizada' })
  @ApiResponse({ status: 404, description: 'Recompensa não encontrada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRewardDto) {
    return this.adminRewardsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete de uma recompensa' })
  @ApiResponse({ status: 204, description: 'Recompensa removida' })
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminRewardsService.softDelete(id);
  }
}
