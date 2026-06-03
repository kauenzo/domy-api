## 1. Estrutura do módulo

- [x] 1.1 Criar `src/modules/admin/users/admin-users.module.ts`
- [x] 1.2 Criar `src/modules/admin/users/admin-users.service.ts`
- [x] 1.3 Criar `src/modules/admin/users/admin-users.controller.ts`
- [x] 1.4 Registrar o módulo no `AppModule`

## 2. DTOs e contrato de entrada

- [x] 2.1 Criar `UpdateUserDto` para `name`, `roles` e `isActive`
- [x] 2.2 Criar `AdjustPointsDto` para ajuste manual de pontos
- [x] 2.3 Validar campos com `class-validator`

## 3. Regras de domínio

- [x] 3.1 Implementar listagem paginada de usuários com filtros básicos
- [x] 3.2 Implementar consulta de detalhe por ID
- [x] 3.3 Implementar atualização parcial do usuário
- [x] 3.4 Implementar soft delete do usuário
- [x] 3.5 Implementar ajuste manual de pontos com transação `manual_adjustment`

## 4. Segurança e integração

- [x] 4.1 Proteger as rotas com autenticação JWT e role `admin`
- [x] 4.2 Garantir consistência entre `points_balance` e `point_transactions`
- [x] 4.3 Validar o fluxo com cenários de usuário inexistente, ajuste inválido e exclusão lógica
