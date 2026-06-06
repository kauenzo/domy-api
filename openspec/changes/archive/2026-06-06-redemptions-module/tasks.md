## 1. DTOs e Types

- [x] 1.1 Criar `RejectRedemptionDto` em `src/modules/admin/redemptions/dto/reject-redemption.dto.ts` com validação de `rejection_reason` (string, required).

## 2. Admin Redemptions Module

- [x] 2.1 Criar `AdminRedemptionsModule` em `src/modules/admin/redemptions/admin-redemptions.module.ts`, registrando o repositório da entity `Redemption` e os demais repositórios necessários.
- [x] 2.2 Importar `NotificationsModule` no `AdminRedemptionsModule` para envio de mensagens.
- [x] 2.3 Criar `AdminRedemptionsService` implementando o método `findAll()` com filtros e paginação simples.
- [x] 2.4 Implementar `AdminRedemptionsService.approve()` com TypeORM transaction para: alterar status, incrementar `stock_used` no Reward, salvar e notificar o usuário.
- [x] 2.5 Implementar `AdminRedemptionsService.reject()` com TypeORM transaction para: alterar status, devolver os pontos via nova `point_transaction` (`type = redemption_refund`), atualizar saldo do usuário e notificar.
- [x] 2.6 Criar `AdminRedemptionsController` documentando os endpoints de listagem, aprovação e rejeição com decorators do Swagger e uso do `AdminGuard`.

## 3. Member Redemptions Module

- [x] 3.1 Criar `RedemptionsModule` em `src/modules/redemptions/redemptions.module.ts`.
- [x] 3.2 Criar `RedemptionsService` implementando a listagem do histórico e busca de detalhe, obrigatoriamente filtrando pelo `user_id` da sessão logada.
- [x] 3.3 Criar `RedemptionsController` documentando os endpoints `GET /redemptions` e `GET /redemptions/:id` com decorators Swagger e `JwtAuthGuard`.

## 4. Integração

- [x] 4.1 Registrar `AdminRedemptionsModule` no `AppModule`.
- [x] 4.2 Registrar `RedemptionsModule` no `AppModule`.
