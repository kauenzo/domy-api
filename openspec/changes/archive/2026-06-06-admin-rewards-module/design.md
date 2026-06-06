## Context

Esta change implementa a fase 13 (`admin-rewards-module`) do roadmap. A entity `Reward` já existe com soft delete, campos de catálogo e controle de estoque (`stock_limit`, `stock_used`). O módulo administrativo de usuários (`admin-users`) já estabelece o padrão de controller fino, service com regras de domínio e guards `AuthGuard('jwt')` + `AdminGuard`.

A principal responsabilidade aqui é expor o CRUD completo do catálogo de recompensas para o admin configurar o que os membros poderão resgatar na fase 14.

## Goals / Non-Goals

**Goals:**
- Expor rotas administrativas CRUD em `/admin/rewards`.
- Permitir criar recompensas com campos de catálogo completos.
- Permitir listar, consultar, editar e soft delete de recompensas.
- Proteger todas as rotas com autenticação JWT e role `admin`.

**Non-Goals:**
- Implementar vitrine ou resgate para membros (fase 14).
- Moderar resgates pendentes (fase 15 — `admin-redemptions-module`).
- Upload de imagens — `cover_image_url` é uma URL externa informada pelo admin.
- Criar novas tabelas ou migrations.

## Decisions

### 1. Reutilizar a entity `Reward` existente
O modelo de dados já cobre todos os campos necessários. Reutilizar a entity evita duplicação e mantém consistência com o schema definido na fase 1.

Alternativas consideradas:
- Criar DTOs persistentes separados da entity.
- Rejeitado por duplicar estado já modelado no banco.

### 2. Service dedicado em `src/modules/admin/rewards`
Segue o padrão dos demais módulos admin (`users`, `invites`). O service centraliza validações, persistência e mapeamento de resposta.

Alternativas consideradas:
- Compartilhar service com o módulo de membro.
- Rejeitado porque as regras de admin (ver soft deleted, editar `stock_limit`) diferem da vitrine do membro.

### 3. DTOs separados para criação e atualização
- `CreateRewardDto`: `title`, `description`, `coverImageUrl`, `pointsCost`, `stockLimit`, `cooldownDays`, `isActive` (todos obrigatórios exceto campos nullable).
- `UpdateRewardDto`: mesmos campos, todos opcionais (`PartialType`).

Alternativas consideradas:
- Um único DTO para create e update.
- Rejeitado porque create exige campos obrigatórios que update trata como parciais.

### 4. `stock_used` não editável pelo admin
O campo `stock_used` é incrementado automaticamente quando resgates são aprovados (fase 15). O admin gerencia apenas `stock_limit`; o consumo é derivado de resgates.

Alternativas consideradas:
- Permitir reset manual de `stock_used`.
- Rejeitado por escopo — pode ser adicionado em change futura se necessário.

### 5. Soft delete como exclusão administrativa
O endpoint `DELETE /admin/rewards/:id` aplica `softDelete()` via `SoftDeleteBaseEntity`, preservando integridade referencial com `redemptions` existentes.

Alternativas consideradas:
- Remoção física.
- Rejeitado por risco de quebrar histórico de resgates.

### 6. Guards em todas as rotas
Todas as rotas usam `@UseGuards(AuthGuard('jwt'), AdminGuard)` no nível do controller, consistente com `AdminUsersController`.

## Risks / Trade-offs

- [Admin desativa recompensa com resgates pendentes] → Mitigação: `is_active = false` impede novos resgates; resgates pendentes continuam processáveis na fase 15.
- [Redução de `stock_limit` abaixo de `stock_used`] → Mitigação: validar no service que `stock_limit >= stock_used` quando informado.
- [Listagem sem paginação avançada] → Mitigação: começar com listagem simples; paginação pode ser adicionada em change futura.

## Migration Plan

1. Criar módulo, service, controller e DTOs em `src/modules/admin/rewards/`.
2. Registrar `AdminRewardsModule` no `AppModule`.
3. Validar CRUD manualmente com token de admin.

## Open Questions

- Se o produto exigir paginação padronizada, esta change pode evoluir para reutilizar um DTO compartilhado de paginação.

## Testes manuais recomendados

1. Criar recompensa com todos os campos e verificar persistência.
2. Listar recompensas e confirmar que soft deleted não aparecem.
3. Editar parcialmente (`PATCH`) apenas `is_active` e `points_cost`.
4. Soft delete e confirmar `404` em consulta posterior.
5. Tentar acesso sem token ou com role membro → `401`/`403`.
6. Criar com `stock_limit` menor que `stock_used` existente → erro de validação.
