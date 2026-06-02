## Why

O sistema precisa de um fluxo de autenticação exclusivo para administradores para separar o acesso privilegiado do acesso de membro. Isso reduz risco operacional e garante que apenas usuários com role `admin` avancem para rotas administrativas.

## What Changes

- Adiciona o fluxo de OAuth Google para admins em `/admin/auth/google` e `/admin/auth/google/callback`.
- Valida a role `admin` no callback antes de emitir sessão.
- Emite access token e refresh token para sessões administrativas.
- Persiste refresh tokens com hash e suporte a revogação.
- Expõe `/admin/auth/refresh` e `/admin/auth/logout` para ciclo completo da sessão admin.
- Rejeita com `403` qualquer usuário autenticado que não possua role `admin`.

## Capabilities

### New Capabilities
- `auth-admin`: autenticação administrativa com Google OAuth, JWT, refresh token, validação de role e revogação de sessão.

### Modified Capabilities
- Nenhuma.

## Impact

- `src/modules/admin/auth/` para strategy, service, controller e module.
- `src/database/entities/refresh-token.entity.ts` para persistência de sessão.
- `src/common/guards/` e `src/common/decorators/` para proteção e autorização.
- Leitura do campo `roles` do usuário para validação de admin.
- Variáveis de ambiente de OAuth Google, JWT e expiração de sessão.
- Testes de autenticação administrativa e negação de acesso sem role.
