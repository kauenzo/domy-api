## Context

Esta change implementa o módulo de convites descrito no roadmap da fase `invites-module`. O banco já possui a entity `invites` e o fluxo de autenticação de membro já sabe consumir um convite no callback, então a principal responsabilidade aqui é expor as operações administrativas e a validação pública do token.

O design deve ser simples e coerente com os módulos já existentes: controller fino, service com as regras de domínio e DTOs específicos para a resposta de criação e validação.

## Goals / Non-Goals

**Goals:**
- Criar convites administráveis via `/admin/invites`.
- Listar convites com status de uso, expiração e criador.
- Invalidar convites manualmente.
- Validar token publicamente em `/invites/:token`.
- Retornar um link completo no momento da criação do convite.

**Non-Goals:**
- Enviar convites por email ou mensagem.
- Gerenciar frontend de onboarding.
- Alterar o fluxo de consumo de convite já implementado no auth member além do necessário para manter compatibilidade.
- Criar novas tabelas ou migrations.

## Decisions

### 1. Reutilizar a entity `Invite`
O modelo já existe no banco e cobre os campos necessários para token, expiração e uso. Reutilizar a entity evita duplicação e mantém a integração com o callback de autenticação simples.

Alternativas consideradas:
- Criar uma entity nova só para o módulo administrativo.
- Rejeitado por duplicar persistência sem benefício funcional.

### 2. Expor um service dedicado em `src/modules/admin/invites`
O módulo administrativo precisa de regras próprias de autorização e de uma API clara para o frontend. Um service dedicado facilita organizar criação, listagem, invalidação e validação pública sem misturar essas regras com autenticação.

Alternativas consideradas:
- Colocar a lógica dentro do auth member.
- Rejeitado porque mistura responsabilidades e torna o fluxo menos explícito.

### 3. Retornar link completo na criação
O contrato do roadmap pede um link pronto para uso pelo frontend. O service vai montar o link com base em uma URL configurável quando disponível e, na ausência disso, vai retornar um link funcional para a própria API.

Alternativas consideradas:
- Retornar apenas o token.
- Rejeitado porque adiciona trabalho desnecessário para o frontend.

### 4. Validar token publicamente sem expor dados sensíveis
A rota pública deve responder apenas o necessário para o frontend saber se o link segue válido. Isso evita vazar informações do criador ou do usuário que usou o convite.

Alternativas consideradas:
- Retornar o registro completo do convite.
- Rejeitado porque expõe mais dados do que o necessário.

## Risks / Trade-offs

- [Link completo depende de URL base configurada] -> Mitigação: permitir fallback seguro para a própria API e manter a resposta útil mesmo sem variável explícita.
- [Conflito entre convites expirados e usados] -> Mitigação: centralizar a regra de validação no service.
- [Listagem administrativa sem paginação] -> Mitigação: começar com listagem simples e expandir se necessário em uma change futura.
- [Integração com auth member] -> Mitigação: manter a lógica de consumo no fluxo atual e validar compatibilidade com os mesmos campos da entity.

## Migration Plan

1. Registrar o módulo admin de convites na aplicação.
2. Expor as rotas administrativas e pública sem mudar o contrato do login de membro.
3. Garantir que o frontend use o token validado em `/invites/:token` antes de redirecionar para o cadastro.
4. Manter a rotina de consumo do convite no callback de autenticação.

## Open Questions

- Se o projeto passar a definir uma URL pública padrão, o link completo pode migrar de fallback para configuração explícita sem mudar o contrato da resposta.
