import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Realiza o cadastro de um novo membro por e-mail/senha',
  })
  @ApiResponse({
    status: 201,
    description: 'Cadastro bem-sucedido, retorna tokens e usuário',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou e-mail já cadastrado',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login de um membro com e-mail/senha' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido, retorna tokens e usuário',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /*
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
    @Res() res: Response,
    @Query('invite') inviteToken?: string,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    try {
      const responseDto = await this.authService.loginWithGoogle(
        request.user as never,
        inviteToken,
      );

      const userParam = encodeURIComponent(JSON.stringify(responseDto.user));
      const redirectUrl = `${frontendUrl}/auth/google/callback?accessToken=${responseDto.accessToken}&refreshToken=${responseDto.refreshToken}&user=${userParam}`;

      res.redirect(redirectUrl);
    } catch (error: any) {
      const errorCode = 'default'; // Customize later if specific errors are thrown
      res.redirect(`${frontendUrl}/auth/google/callback?error=${errorCode}`);
    }
  }
  */

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
