## 1. Estrutura do módulo

- [x] 1.1 Criar `src/modules/admin/rewards/admin-rewards.module.ts`
- [x] 1.2 Criar `src/modules/admin/rewards/admin-rewards.service.ts`
- [x] 1.3 Criar `src/modules/admin/rewards/admin-rewards.controller.ts`
- [x] 1.4 Registrar o módulo no `AppModule`

## 2. DTOs e contrato de entrada

- [x] 2.1 Criar `CreateRewardDto` com `title`, `description`, `coverImageUrl`, `pointsCost`, `stockLimit`, `cooldownDays`, `isActive`
- [x] 2.2 Criar `UpdateRewardDto` como parcial de `CreateRewardDto`
- [x] 2.3 Validar campos com `class-validator`

## 3. Regras de domínio

- [x] 3.1 Implementar listagem de recompensas (excluindo soft deleted)
- [x] 3.2 Implementar criação com `stock_used = 0`
- [x] 3.3 Implementar consulta por ID
- [x] 3.4 Implementar atualização parcial com validação `stock_limit >= stock_used`
- [x] 3.5 Implementar soft delete

## 4. Segurança e integração

- [x] 4.1 Proteger rotas com `AuthGuard('jwt')` e `AdminGuard`
- [x] 4.2 Validar fluxo com cenários de recompensa inexistente, estoque inválido e acesso não autorizado
