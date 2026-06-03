## 1. Base do módulo de convites

- [x] 1.1 Criar a estrutura `src/modules/admin/invites/` com `invites.module.ts`, `invites.service.ts` e `invites.controller.ts`
- [x] 1.2 Registrar a entity `Invite` no módulo e garantir acesso ao repositório
- [x] 1.3 Integrar o módulo na aplicação raiz para expor as rotas administrativas e pública

## 2. Regras de domínio

- [x] 2.1 Implementar `createInvite()` com token UUID e expiração de 48 horas
- [x] 2.2 Implementar `validateToken()` para checar existência, expiração e uso
- [x] 2.3 Implementar `useInvite()` para marcar `used_by` e `used_at`
- [x] 2.4 Incluir suporte a link completo na resposta de criação

## 3. Rotas e DTOs

- [x] 3.1 Implementar `POST /admin/invites`
- [x] 3.2 Implementar `GET /admin/invites`
- [x] 3.3 Implementar `DELETE /admin/invites/:id`
- [x] 3.4 Implementar `GET /invites/:token`
- [x] 3.5 Criar DTOs de resposta para criação e validação

## 4. Segurança e integração

- [x] 4.1 Proteger as rotas administrativas com autenticação de admin
- [x] 4.2 Garantir que o callback do auth member continue consumindo o convite corretamente
- [x] 4.3 Cobrir os cenários de token inválido, expirado e já usado
