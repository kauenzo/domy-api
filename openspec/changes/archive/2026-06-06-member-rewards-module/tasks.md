## 1. Estrutura do módulo

- [x] 1.1 Criar `src/modules/rewards/rewards.module.ts`
- [x] 1.2 Criar `src/modules/rewards/rewards.service.ts`
- [x] 1.3 Criar `src/modules/rewards/rewards.controller.ts`
- [x] 1.4 Registrar o módulo no `AppModule`

## 2. Vitrine e consulta

- [x] 2.1 Implementar listagem filtrando recompensas ativas, não excluídas e com estoque disponível
- [x] 2.2 Implementar consulta de detalhe por ID com mesmos filtros de disponibilidade

## 3. Resgate com validações

- [x] 3.1 Implementar `redeem()` com validação de recompensa ativa e estoque
- [x] 3.2 Validar saldo suficiente (`points_balance >= points_cost`)
- [x] 3.3 Validar cooldown desde última redemption aprovada do par `user_id + reward_id`
- [x] 3.4 Executar transação atômica: débito de pontos + criação de `redemption` pending + `point_transaction` redemption_debit

## 4. Segurança e integração

- [x] 4.1 Proteger rotas com `AuthGuard('jwt')` e obter usuário via `@CurrentUser()`
- [x] 4.2 Validar fluxo com cenários de saldo insuficiente, estoque esgotado, cooldown ativo e acesso não autorizado
