## Context

Esta change implementa a fase 14 (`member-rewards-module`) do roadmap. Depende do catálogo gerenciável pelo admin (fase 13). As entities `Reward`, `Redemption`, `PointTransaction` e `User` já existem. O fluxo de resgate debita pontos imediatamente ao solicitar e cria uma `redemption` em status `pending` para revisão posterior pelo admin (fase 15).

O design concentra validações de negócio no service e usa transação de banco para garantir atomicidade entre débito de pontos, criação de `redemption` e `point_transaction`.

## Goals / Non-Goals

**Goals:**
- Expor vitrine de recompensas ativas com estoque disponível em `GET /rewards`.
- Permitir consulta de detalhe em `GET /rewards/:id`.
- Implementar solicitação de resgate em `POST /rewards/:id/redeem` com validações completas.
- Debitar pontos imediatamente via `point_transaction` tipo `redemption_debit`.
- Criar `redemption` com status `pending`.

**Non-Goals:**
- Aprovar ou rejeitar resgates (fase 15 — `admin-redemptions-module`).
- Incrementar `stock_used` no resgate — ocorre na aprovação (fase 15).
- Enviar notificações ao solicitar resgate.
- Criar novas tabelas ou migrations.

## Decisions

### 1. Service dedicado em `src/modules/rewards`
Módulo separado do admin, focado na perspectiva do membro. Filtra recompensas ativas, não soft deleted e com estoque disponível na vitrine.

Alternativas consideradas:
- Reutilizar `AdminRewardsService` com filtros.
- Rejeitado por misturar responsabilidades e expor campos administrativos.

### 2. Filtro de vitrine no service
A listagem retorna apenas recompensas onde:
- `is_active = true`
- `deleted_at IS NULL`
- `stock_limit IS NULL OR stock_used < stock_limit`

Alternativas consideradas:
- Retornar todas e filtrar no frontend.
- Rejeitado porque expõe recompensas indisponíveis desnecessariamente.

### 3. Validações no `redeem()` em ordem
1. Recompensa existe, ativa e não soft deleted.
2. Estoque disponível (`stock_limit IS NULL OR stock_used < stock_limit`).
3. Saldo suficiente (`user.points_balance >= reward.points_cost`).
4. Cooldown respeitado: se `cooldown_days` definido, a última `redemption` **aprovada** do par `user_id + reward_id` deve ter `reviewed_at` há pelo menos `cooldown_days` dias.

Alternativas consideradas:
- Considerar resgates pendentes no cooldown.
- Rejeitado: cooldown mede intervalo entre resgates efetivamente aprovados, conforme roadmap.

### 4. Transação atômica no resgate
Usar `DataSource.transaction()` ou `QueryRunner` para, em uma única transação:
1. Decrementar `user.points_balance` pelo `points_cost`.
2. Criar `redemption` com `status = pending` e `points_cost` snapshot.
3. Criar `point_transaction` com `type = redemption_debit`, `amount` negativo, `reference_id = redemption.id`.

Alternativas consideradas:
- Operações separadas sem transação.
- Rejeitado por risco de inconsistência entre saldo e histórico.

### 5. Snapshot de `points_cost` na redemption
Persistir o `points_cost` vigente no momento do resgate na `redemption`, independente de alterações futuras no catálogo.

Alternativas consideradas:
- Referenciar apenas `reward.points_cost`.
- Rejeitado porque alterações no catálogo distorceriam histórico de resgates.

### 6. Guards de membro
Rotas protegidas com `@UseGuards(AuthGuard('jwt'))`. O usuário autenticado é obtido via `@CurrentUser()` decorator.

## Risks / Trade-offs

- [Concorrência no estoque] → Mitigação: transação atômica; validação de estoque dentro da transação. Incremento de `stock_used` na aprovação (fase 15) com lock adicional.
- [Resgate com saldo insuficiente após race condition] → Mitigação: verificar saldo dentro da transação com lock pessimista ou recheck.
- [Cooldown com timezone] → Mitigação: calcular diferença em dias usando UTC/timestamp do banco.
- [Recompensa desativada entre vitrine e resgate] → Mitigação: revalidar `is_active` dentro do `redeem()`.

## Migration Plan

1. Criar módulo, service e controller em `src/modules/rewards/`.
2. Registrar `RewardsModule` no `AppModule`.
3. Validar vitrine, detalhe e resgate manualmente com token de membro.

## Open Questions

- Se resgates pendentes devem bloquear novo resgate da mesma recompensa, a regra pode ser adicionada em change futura. Por ora, apenas cooldown de aprovados e saldo são validados.

## Testes manuais recomendados

1. Listar vitrine — apenas recompensas ativas com estoque.
2. Consultar detalhe de recompensa disponível e indisponível (`404` ou oculta).
3. Resgatar com saldo suficiente → `redemption` pending + débito de pontos + transação criada.
4. Resgatar com saldo insuficiente → erro `400`.
5. Resgatar recompensa inativa ou sem estoque → erro `400`.
6. Resgatar dentro do cooldown → erro `400`.
7. Resgatar sem autenticação → `401`.
