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
import { AdminGuard } from '../../../common/guards/admin.guard';
import { AdminRewardsService } from './admin-rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Controller('admin/rewards')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminRewardsController {
  constructor(private readonly adminRewardsService: AdminRewardsService) {}

  @Get()
  list() {
    return this.adminRewardsService.list();
  }

  @Post()
  create(@Body() dto: CreateRewardDto) {
    return this.adminRewardsService.create(dto);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminRewardsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRewardDto) {
    return this.adminRewardsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminRewardsService.softDelete(id);
  }
}
