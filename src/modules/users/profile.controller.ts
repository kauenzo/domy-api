import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/types/authenticated-request.type';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { ProfileWithStats } from './users.service';
import { UsersService } from './users.service';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Retorna o perfil e as estatísticas do membro logado',
  })
  @ApiResponse({ status: 200, description: 'Perfil e stats do membro' })
  getProfile(@CurrentUser() user: AuthUser): Promise<ProfileWithStats> {
    return this.usersService.getProfileWithStats(user.id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Atualiza o perfil do membro logado (nome e/ou avatar)',
  })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileWithStats> {
    return this.usersService.updateProfile(user.id, dto);
  }
}
