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
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../../common/guards/admin.guard';
import { TaskInstanceStatus } from '../../../database/entities/task-instance.entity';
import { AdminTaskInstancesService } from './admin-task-instances.service';
import { UpdateTaskInstanceDto } from './dto/update-task-instance.dto';

@ApiTags('Admin / Instâncias de Tarefas')
@Controller('admin/task-instances')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminTaskInstancesController {
  constructor(
    private readonly adminTaskInstancesService: AdminTaskInstancesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lista instâncias de tarefas com filtros opcionais',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    example: '2026-07-01',
  })
  @ApiQuery({ name: 'status', required: false, enum: TaskInstanceStatus })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  findAll(
    @Query('date') date?: string,
    @Query('status') status?: TaskInstanceStatus,
    @Query('userId') userId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminTaskInstancesService.list({
      date,
      status,
      userId,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna o detalhe de uma instância de tarefa' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminTaskInstancesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Edita campos de override de uma ocorrência avulsa (is_exception = true)',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskInstanceDto,
  ) {
    return this.adminTaskInstancesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete de uma instância de tarefa' })
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminTaskInstancesService.softDelete(id);
  }
}
