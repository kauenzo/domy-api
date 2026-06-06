## Why

O admin precisa gerenciar o catálogo de recompensas que os membros podem resgatar com pontos. A fase 13 do roadmap cobre o CRUD completo do catálogo, permitindo configurar custo em pontos, estoque, cooldown e visibilidade antes que os membros acessem a vitrine na fase 14.

## What Changes

- Adiciona um módulo administrativo de recompensas em `/admin/rewards`.
- Permite listar, criar, consultar, editar e excluir recompensas.
- Expõe campos de catálogo: `title`, `description`, `cover_image_url`, `points_cost`, `stock_limit`, `cooldown_days`, `is_active`.
- Aplica soft delete em recompensas removidas pelo admin.

### Endpoints

```
GET    /admin/rewards
POST   /admin/rewards
GET    /admin/rewards/:id
PATCH  /admin/rewards/:id
DELETE /admin/rewards/:id
```

## Capabilities

### New Capabilities
- `admin-rewards-module`: administração do catálogo de recompensas com CRUD completo e soft delete.

### Modified Capabilities
- _(nenhuma — a entity `Reward` já está definida em `database-schema`)_

## Impact

- `src/modules/admin/rewards/` para service, controller, module e DTOs.
- `src/database/entities/reward.entity.ts` para leitura e persistência.
- `src/app.module.ts` para registrar o novo módulo administrativo.
- Rotas protegidas por autenticação JWT e role `admin`.
- Depende da fase 1 (entities) concluída; desbloqueia a fase 14 (vitrine e resgate do membro).
