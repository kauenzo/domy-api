## Context

Esta change implementa o fluxo de autenticação de admin definido no roadmap da fase `auth-admin`. O sistema já possui a base de banco e módulos compartilhados, então o trabalho aqui é criar uma superfície administrativa isolada, com validação explícita de role.

O objetivo principal é evitar que um usuário membro consiga entrar por rotas administrativas apenas por compartilhar o mesmo provedor Google. O design precisa considerar revogação, separação de rotas e validação contínua de autorização.

## Goals / Non-Goals

**Goals:**
- Autenticar admins via Google OAuth em rotas dedicadas.
- Validar a role `admin` antes de emitir sessão.
- Emitir access token e refresh token para sessão administrativa.
- Armazenar refresh token com hash e permitir revogação.
- Expor endpoints de refresh e logout do admin.
- Rejeitar qualquer usuário sem role `admin` com `403`.

**Non-Goals:**
- Fluxo de autenticação de membro.
- Gestão de usuários, tarefas ou recompensas administrativas.
- UI de login administrativa.
- Sincronização automática de roles fora do login e refresh.

## Decisions

### 1. Criar módulo administrativo separado em `src/modules/admin/auth`
Separar o fluxo admin mantém o contrato das rotas mais seguro e explícito, além de evitar mistura com o login de membro. Também facilita aplicar prefixo `/admin` e políticas próprias sem ramificações complexas.

Alternativas consideradas:
- Reutilizar o módulo de membro com um parâmetro de role.
- Rejeitado por aumentar o risco de autorização acidentalmente permissiva.

### 2. Validar role `admin` no callback e no refresh
O callback deve bloquear imediatamente usuários sem role, e o refresh também deve revalidar a role para impedir que uma sessão continue válida após revogação de permissão.

Alternativas consideradas:
- Validar apenas no login inicial.
- Rejeitado porque deixa janelas de acesso indevido quando roles mudam.

### 3. Reaproveitar o mesmo modelo de `refresh_tokens`
Usar a mesma tabela de refresh tokens mantém o modelo simples e reduz duplicação de persistência. A distinção de admin fica no módulo e na autorização, não na estrutura de sessão.

Alternativas consideradas:
- Criar tabela separada para admin.
- Rejeitado porque adiciona complexidade sem ganho funcional relevante.

### 4. Usar estratégia dedicada de OAuth para admin
Uma strategy própria facilita callbacks, logs e futuras variações de escopo sem contaminar o fluxo de membro. Também torna o comportamento administrativo mais fácil de testar.

Alternativas consideradas:
- Compartilhar uma strategy única e distinguir apenas por rota.
- Rejeitado porque reduz clareza e complica manutenção.

## Risks / Trade-offs

- [Usuário perde role depois de logado] -> Mitigação: revalidar role em refresh e proteger todas as rotas admin com guard de autorização.
- [Ambiguidade entre session admin e member] -> Mitigação: rotas com prefixo `/admin/auth` e módulo dedicado.
- [Dependência do mesmo provedor Google para dois fluxos] -> Mitigação: separar callbacks e regras de autorização por módulo.
- [Falhas de autorização em produção] -> Mitigação: cobertura de testes para callback, refresh e negação de acesso sem role.

## Migration Plan

1. Registrar o módulo admin auth nas dependências do app.
2. Configurar variáveis de ambiente de Google OAuth e JWT no ambiente alvo.
3. Confirmar que a role `admin` já está representada no campo `roles` da entity de usuário.
4. Publicar as rotas administrativas sem alterar o fluxo de membro.
5. Se necessário, desligar apenas o módulo administrativo sem afetar autenticação de membros.

## Open Questions

- Nenhuma pendência técnica crítica no momento.
