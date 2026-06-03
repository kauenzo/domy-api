## Why

O sistema precisa de um fluxo formal de convites para que administradores possam liberar o cadastro de novos membros por link com validade limitada. Isso reduz o uso indevido de cadastros abertos e mantém o onboarding alinhado com o modelo gamificado do produto.

## What Changes

- Adiciona um módulo administrativo de convites em `/admin/invites`.
- Permite criar convites com token UUID e expiração de 48 horas.
- Permite listar convites com status de uso e validade.
- Permite invalidar convites manualmente.
- Expõe uma rota pública `/invites/:token` para validação do token pelo frontend.
- Reaproveita a entity `invites` já existente e a integração com o callback de autenticação de membro.

## Capabilities

### New Capabilities
- `invites-module`: criação, listagem, invalidação e validação pública de convites.

### Modified Capabilities
- `auth-member`: consumo do convite no callback já existente permanece funcionando com o novo ciclo de geração e validação.

## Impact

- `src/modules/admin/invites/` para service, controller, module e DTOs.
- `src/modules/auth/` para manter o consumo do convite no fluxo de cadastro.
- `src/database/entities/invite.entity.ts` para persistência já modelada.
- Rotas administrativas protegidas por autenticação de admin.
- Rota pública de validação usada pelo frontend para checagem do link.
