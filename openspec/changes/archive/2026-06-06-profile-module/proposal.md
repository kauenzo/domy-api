## Why

A implementação do Módulo de Perfil (Fase 19) permite que os próprios membros visualizem suas estatísticas consolidadas e editem informações básicas. Isso engaja o usuário e proporciona autonomia, permitindo que ele acompanhe de perto o seu próprio progresso (pontos, streak e nível) e mantenha suas informações (como avatar e nome) atualizadas.

## What Changes

- Criação de recursos para o membro gerenciar e visualizar seu próprio perfil.
- Retorno de estatísticas consolidadas da gamificação (saldo de pontos, streak atual e máximo, nível e total de tarefas concluídas).
- Permissão para edição de nome e URL de avatar.
- **Lista de endpoints implementados:**
  - `GET /profile` → dados do usuário + stats consolidados.
  - `PATCH /profile` → edita nome, avatar_url.

## Capabilities

### New Capabilities
- `member-profile`: Visualização e edição do perfil do próprio membro (nome, avatar) e acesso ao resumo do seu progresso gamificado (nível, streak, pontos).

### Modified Capabilities

## Impact

- **API**: Novos endpoints públicos para membros autenticados no prefixo `/profile`.
- **Código**: Extensão ou criação de controller de perfil em `src/modules/users/`, reutilizando o `UsersService`.
- **Dependências**: Nenhuma alteração estrutural nas tabelas. O endpoint fará a compilação de stats (saldo, streak, nível) a partir da tabela `users` e `task_instances`.
