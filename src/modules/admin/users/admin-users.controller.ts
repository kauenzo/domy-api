import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
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
import { AdminUsersService } from './admin-users.service';
import { AdjustPointsDto } from './dto/adjust-points.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('admin/users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista membros com paginação e filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada de membros' })
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminUsersService.listUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna os detalhes de um membro específico' })
  @ApiResponse({ status: 200, description: 'Dados do membro' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminUsersService.findById(id);
  }

  @Patch(':id/points')
  @ApiOperation({ summary: 'Ajuste manual de pontos de um membro' })
  @ApiResponse({
    status: 200,
    description: 'Pontos ajustados, transação criada',
  })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  adjustPoints(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AdjustPointsDto,
  ) {
    return this.adminUsersService.adjustPoints(id, body);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza nome, roles ou status ativo de um membro',
  })
  @ApiResponse({ status: 200, description: 'Membro atualizado' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.adminUsersService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete de um membro' })
  @ApiResponse({ status: 200, description: 'Membro desativado (soft delete)' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  async softDeleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true }> {
    await this.adminUsersService.softDeleteUser(id);
    return { success: true };
  }
}
