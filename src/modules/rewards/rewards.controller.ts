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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/types/authenticated-request.type';
import { RewardsService } from './rewards.service';

@Controller('rewards')
@UseGuards(AuthGuard('jwt'))
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  listAvailable() {
    return this.rewardsService.listAvailable();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.rewardsService.findAvailableById(id);
  }

  @Post(':id/redeem')
  @HttpCode(HttpStatus.CREATED)
  redeem(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.rewardsService.redeem(id, user.id);
  }
}
