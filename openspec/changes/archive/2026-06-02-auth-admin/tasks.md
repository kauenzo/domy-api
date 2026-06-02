## 1. Base do módulo admin auth

- [x] 1.1 Criar a estrutura `src/modules/admin/auth/` com `admin-auth.module.ts`, `admin-auth.service.ts` e `admin-auth.controller.ts`
- [x] 1.2 Registrar as variáveis de ambiente necessárias para Google OAuth, JWT e expirações da sessão
- [x] 1.3 Garantir o registro do módulo admin auth no módulo raiz da aplicação

## 2. Strategies e autorização

- [x] 2.1 Implementar `google-admin.strategy.ts` para login administrativo via Google OAuth
- [x] 2.2 Validar a role `admin` no callback antes de emitir tokens
- [x] 2.3 Revalidar a role `admin` no refresh para impedir sessão após remoção de permissão
- [x] 2.4 Implementar a lógica de emissão, rotação e revogação de refresh token no service
- [x] 2.5 Integrar a entity `refresh_tokens` com hash e timestamps de revogação

## 3. Rotas e DTOs

- [x] 3.1 Implementar `POST /admin/auth/google` e `GET /admin/auth/google/callback`
- [x] 3.2 Implementar `POST /admin/auth/refresh` e `POST /admin/auth/logout`
- [x] 3.3 Padronizar a resposta de tokens para o frontend administrativo
- [x] 3.4 Garantir retorno `403` para usuários sem role `admin`

## 4. Proteção e testes

- [x] 4.1 Cobrir o fluxo feliz de login, refresh e logout administrativo com testes de service
- [x] 4.2 Cobrir o retorno `403` quando o usuário não tiver role `admin`
- [x] 4.3 Cobrir renovação negada após remoção da role
- [x] 4.4 Validar o contrato dos controladores com testes de controller
