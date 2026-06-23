import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../../../common/types/authenticated-request.type';
import { RefreshTokenDto } from '../../auth/dto/refresh-token.dto';
import { AdminAuthService } from './admin-auth.service';

@ApiTags('admin/auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google-admin'))
  @ApiOperation({ summary: 'Inicia o fluxo OAuth Google para administradores' })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para o Google OAuth (admin)',
  })
  googleLogin(): void {
    // Passport intercepta esta rota e inicia o redirecionamento OAuth.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google-admin'))
  @ApiOperation({
    summary: 'Callback OAuth Google (admin) — valida role e retorna JWT',
  })
  @ApiResponse({ status: 200, description: 'Login admin bem-sucedido' })
  @ApiResponse({ status: 403, description: 'Usuário não possui role admin' })
  async googleCallback(
    @Req() request: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    try {
      const responseDto = await this.adminAuthService.loginWithGoogle(
        request.user as never,
      );

      const userParam = encodeURIComponent(JSON.stringify(responseDto.user));
      const redirectUrl = `${frontendUrl}/admin/auth/google/callback?accessToken=${responseDto.accessToken}&refreshToken=${responseDto.refreshToken}&user=${userParam}`;

      res.redirect(redirectUrl);
    } catch (error: any) {
      const isForbidden =
        error.status === 403 || error.response?.statusCode === 403;
      const errorCode = isForbidden ? 'forbidden' : 'default';
      res.redirect(
        `${frontendUrl}/admin/auth/google/callback?error=${errorCode}`,
      );
    }
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Renova o access token (admin)' })
  @ApiResponse({ status: 200, description: 'Novos tokens gerados' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refresh(
    @Req() request: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ) {
    return this.adminAuthService.refreshTokens(
      request.user!.id,
      body.refreshToken,
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encerra a sessão do admin' })
  @ApiResponse({ status: 200, description: 'Sessão encerrada' })
  async logout(
    @Req() request: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ): Promise<{ success: true }> {
    await this.adminAuthService.logout(request.user!.id, body.refreshToken);
    return { success: true };
  }
}
