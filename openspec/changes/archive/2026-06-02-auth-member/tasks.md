## 1. Base do módulo de auth

- [x] 1.1 Criar a estrutura `src/modules/auth/` com `auth.module.ts`, `auth.service.ts` e `auth.controller.ts`
- [x] 1.2 Registrar as variáveis de ambiente necessárias para Google OAuth, JWT e expirações da sessão
- [x] 1.3 Garantir o registro do módulo de auth no `AppModule`

## 2. Strategies e sessão

- [x] 2.1 Implementar `google.strategy.ts` para login de membro via Google OAuth
- [x] 2.2 Implementar `jwt.strategy.ts` para proteger rotas autenticadas
- [x] 2.3 Implementar `jwt-refresh.strategy.ts` para validar refresh token
- [x] 2.4 Implementar lógica de emissão, rotação e revogação de refresh token no service
- [x] 2.5 Integrar a entity `refresh_tokens` com hash e timestamps de revogação

## 3. Rotas e DTOs

- [x] 3.1 Implementar `POST /auth/google` e `GET /auth/google/callback`
- [x] 3.2 Implementar `POST /auth/refresh` e `POST /auth/logout`
- [x] 3.3 Implementar `GET /auth/me` protegido por JWT
- [x] 3.4 Criar DTOs de resposta e entrada necessários para refresh e retorno de sessão

## 4. Convites e autorização

- [x] 4.1 Integrar a leitura de `invite` no callback de autenticação
- [x] 4.2 Validar token de convite e marcar uso somente após login concluído com sucesso
- [x] 4.3 Garantir que o perfil retornado por `/auth/me` respeite o usuário autenticado

## 5. Testes e validação

- [x] 5.1 Cobrir o fluxo feliz de login, refresh e logout com testes de service
- [x] 5.2 Cobrir o vínculo de convite em caso válido e inválido
- [x] 5.3 Cobrir respostas `401` para acesso sem token e falhas de refresh
- [x] 5.4 Revisar o contrato de retorno dos endpoints com testes de controller
