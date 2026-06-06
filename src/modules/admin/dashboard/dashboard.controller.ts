import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { DashboardService } from './dashboard.service';
import { DashboardOverviewDto } from './dto/dashboard-overview.dto';
import { MemberMetricsDto } from './dto/member-metrics.dto';

@ApiTags('admin/dashboard')
@ApiBearerAuth()
@Controller('admin/dashboard')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Métricas gerais do dashboard (admin)' })
  @ApiResponse({ status: 200, type: DashboardOverviewDto })
  getGeneralOverview(): Promise<DashboardOverviewDto> {
    return this.dashboardService.getGeneralOverview();
  }

  @Get('members/:id')
  @ApiOperation({ summary: 'Métricas detalhadas de um membro específico' })
  @ApiResponse({ status: 200, type: MemberMetricsDto })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  getMemberMetrics(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MemberMetricsDto> {
    return this.dashboardService.getMemberMetrics(id);
  }
}
