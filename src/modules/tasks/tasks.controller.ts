import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary:
      'Retorna as tarefas do membro para a data informada (padrão: hoje)',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    example: '2026-07-01',
    description: 'Data no formato YYYY-MM-DD. Omita para usar a data de hoje.',
  })
  @ApiResponse({ status: 200, description: 'Lista de tarefas do dia' })
  findByDate(@CurrentUser() user: AuthUser, @Query('date') date?: string) {
    return this.tasksService.findByDate(user.id, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna o detalhe de uma tarefa do membro' })
  @ApiResponse({ status: 200, description: 'Detalhes da tarefa' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.tasksService.findOne(user.id, id);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicia uma tarefa (pending → in_progress)' })
  @ApiResponse({ status: 200, description: 'Tarefa iniciada' })
  start(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.start(user.id, id);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Conclui uma tarefa, calcula pontos com bônus de streak e atualiza saldo',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarefa concluída, pontos atualizados',
  })
  complete(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.tasksService.complete(user.id, id);
  }
}
