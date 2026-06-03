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
import { AdminGuard } from '../../../common/guards/admin.guard';
import { AdminUsersService } from './admin-users.service';
import { AdjustPointsDto } from './dto/adjust-points.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminUsersService.listUsers(query);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminUsersService.findById(id);
  }

  @Patch(':id/points')
  adjustPoints(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AdjustPointsDto,
  ) {
    return this.adminUsersService.adjustPoints(id, body);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.adminUsersService.updateUser(id, body);
  }

  @Delete(':id')
  async softDeleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true }> {
    await this.adminUsersService.softDeleteUser(id);
    return { success: true };
  }
}
