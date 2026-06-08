import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Inicia o fluxo OAuth Google para membros' })
  @ApiResponse({ status: 302, description: 'Redireciona para o Google OAuth' })
  googleLogin(): void {
    // Passport intercepta esta rota e inicia o redirecionamento OAuth.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Callback do OAuth Google — retorna JWT e dados do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido, retorna tokens de acesso',
  })
  @ApiResponse({ status: 401, description: 'Autenticação falhou' })
  async googleCallback(
    @Req() request: AuthenticatedRequest,
    @Query('invite') inviteToken?: string,
  ) {
    return this.authService.loginWithGoogle(request.user as never, inviteToken);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Renova o access token usando o refresh token' })
  @ApiResponse({ status: 200, description: 'Novos tokens gerados com sucesso' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou revogado',
  })
  async refresh(
    @Req() request: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(request.user!.id, body.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoga o refresh token e encerra a sessão' })
  @ApiResponse({ status: 200, description: 'Sessão encerrada com sucesso' })
  async logout(
    @Req() request: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ): Promise<{ success: true }> {
    await this.authService.logout(request.user!.id, body.refreshToken);
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user!.id);
  }
}
