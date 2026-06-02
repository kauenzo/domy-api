## Why

O aplicativo precisa de um fluxo de autenticação separado para membros para permitir login com Google, renovação de sessão e acesso ao perfil sem depender do fluxo administrativo. Isso destrava as próximas fases de convites, tarefas e recompensas com uma base de autenticação previsível e segura.

## What Changes

- Adiciona o fluxo de OAuth Google para membros em `/auth/google` e `/auth/google/callback`.
- Emite access token e refresh token para sessões de membro.
- Persiste refresh tokens com hash e suporte a revogação.
- Expõe `/auth/refresh`, `/auth/logout` e `/auth/me` para ciclo completo da sessão.
- Integra o callback com convites quando `?invite=<token>` estiver presente.

## Capabilities

### New Capabilities
- `auth-member`: autenticação de membro com Google OAuth, JWT, refresh token, revogação de sessão, perfil autenticado e vínculo opcional com convite.

### Modified Capabilities
- Nenhuma.

## Impact

- `src/modules/auth/` para strategy, service, controller e module.
- `src/database/entities/refresh-token.entity.ts` para persistência de sessão.
- `src/common/guards/` e `src/common/decorators/` para proteção de rotas autenticadas.
- Integração com o módulo de convites no callback de login.
- Variáveis de ambiente de OAuth Google, JWT e expiração de sessão.
- Testes de autenticação, renovação de token e fluxo de convite.
