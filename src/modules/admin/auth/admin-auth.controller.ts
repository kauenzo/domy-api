import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../../../common/types/authenticated-request.type';
import { RefreshTokenDto } from '../../auth/dto/refresh-token.dto';
import { AdminAuthService } from './admin-auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google-admin'))
  googleLogin(): void {
    // Passport intercepta esta rota e inicia o redirecionamento OAuth.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google-admin'))
  async googleCallback(@Req() request: AuthenticatedRequest) {
    return this.adminAuthService.loginWithGoogle(request.user as never);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
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
  async logout(
    @Req() request: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ): Promise<{ success: true }> {
    await this.adminAuthService.logout(request.user!.id, body.refreshToken);
    return { success: true };
  }
}
