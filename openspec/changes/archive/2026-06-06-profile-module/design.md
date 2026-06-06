## Context

Os membros do sistema domy-api participam ativamente da plataforma concluindo tarefas e resgatando recompensas. Atualmente, faltava um módulo específico onde o usuário (membro) pudesse gerenciar seu próprio perfil e consultar facilmente um resumo da sua conta.

## Goals / Non-Goals

**Goals:**
- Prover um endpoint onde o membro autenticado acesse as próprias informações com stats consolidadas.
- Prover um endpoint onde o membro possa alterar seu próprio nome e imagem de perfil (avatar).

**Non-Goals:**
- Implementação de upload de arquivos de imagem (o avatar será apenas uma URL informada pelo frontend nesta fase).
- Alteração de senha, e-mail ou exclusão de conta via esse módulo (estas capacidades ficam de fora do MVP de perfil membro).

## Decisions

- **Arquitetura do Módulo**: Será utilizado o módulo existente `UsersModule` (já utilizado pelo Admin), criando um novo `ProfileController` focado no membro (`src/modules/users/profile.controller.ts` ou similar).
  - **Rationale**: O `UsersService` já manipula a entidade `User` de forma centralizada. Evita duplicação de lógica para buscar e salvar o usuário.
- **DTOs Específicos**: Criação do `UpdateProfileDto` com validação `class-validator` (contendo apenas os campos permitidos: `name` e `avatar_url`) para garantir que o membro não possa escalar privilégios (ex: atualizar seus próprios pontos ou nível).
- **Consolidação de Stats**: O GET retornará as propriedades já presentes no usuário (points_balance, current_streak, longest_streak, level) somado com uma contagem simples de `task_instances` concluídas por aquele usuário.

## Risks / Trade-offs

- [Risk] Exposição de dados sensíveis na rota `/profile`.
  - Mitigation: O controller deverá utilizar uma serialização segura (ex: usar class-transformer com `@Exclude()`) para garantir que dados internos não serão vazados no payload JSON da resposta.
