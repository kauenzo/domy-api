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
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {
    // Passport intercepta esta rota e inicia o redirecionamento OAuth.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() request: AuthenticatedRequest,
    @Query('invite') inviteToken?: string,
  ) {
    return this.authService.loginWithGoogle(request.user as never, inviteToken);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(
    @Req() request: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(request.user!.id, body.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt-refresh'))
  async logout(
    @Req() request: AuthenticatedRequest,
    @Body() body: RefreshTokenDto,
  ): Promise<{ success: true }> {
    await this.authService.logout(request.user!.id, body.refreshToken);
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user!.id);
  }
}
