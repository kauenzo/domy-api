## Context

Esta change implementa a fase `admin-users-module` do roadmap. O projeto já possui a entity `User`, a entity `PointTransaction`, os guards de admin e os módulos de autenticação, então a mudança deve se concentrar em regras de administração de membros sem alterar o fluxo de login.

O design segue o padrão já usado no backend: controller fino, service concentrando as regras e DTOs específicos para entrada. O histórico de pontos precisa ser persistido em `point_transactions` sempre que houver ajuste manual, para manter rastreabilidade.

## Goals / Non-Goals

**Goals:**
- Expor rotas administrativas para listar, consultar, editar, desativar e remover usuários.
- Permitir ajuste manual de pontos com lançamento de transação do tipo `manual_adjustment`.
- Manter o saldo do usuário sincronizado com o ajuste aplicado.
- Respeitar soft delete ao excluir usuários.

**Non-Goals:**
- Criar interface de frontend.
- Alterar o fluxo de autenticação ou cadastro.
- Implementar moderação avançada de papéis ou permissões por equipe.
- Criar novas tabelas ou migrations.

## Decisions

### 1. Reutilizar as entities existentes `User` e `PointTransaction`
O modelo de dados já cobre o necessário para a administração de membros e histórico de pontos. Reutilizar essas entities evita duplicação e mantém o módulo alinhado com o restante do sistema.

Alternativas consideradas:
- Criar DTOs persistentes dedicados para usuários administrativos.
- Rejeitado por duplicar estado já modelado no banco.

### 2. Centralizar as regras no service
O service vai validar existência do usuário, aplicar edição, soft delete e ajuste de pontos, garantindo que o controller permaneça apenas como camada de transporte.

Alternativas consideradas:
- Distribuir regras em guards ou interceptors.
- Rejeitado porque tornaria a lógica menos explícita e mais difícil de manter.

### 3. Registrar ajuste manual como transação
Cada ajuste de pontos deve gerar um registro em `point_transactions` com `type = manual_adjustment`, `amount` assinado conforme o delta aplicado e descrição contextual.

Alternativas consideradas:
- Atualizar apenas `points_balance`.
- Rejeitado porque perderia auditoria e rastreabilidade.

### 4. Soft delete como exclusão administrativa
O endpoint de delete deve aplicar exclusão lógica em vez de remoção física. Isso preserva integridade referencial e possibilita auditoria futura.

Alternativas consideradas:
- Remoção física do registro.
- Rejeitado por risco de quebrar relacionamentos e perder histórico.

## Risks / Trade-offs

- [Ajuste manual negativo pode deixar saldo abaixo de zero] -> Mitigação: validar saldo final antes de persistir a alteração.
- [Listagem sem regras avançadas de paginação] -> Mitigação: começar com paginação simples e filtros básicos, ampliando em change futura se necessário.
- [Edição de roles pode promover um membro a admin] -> Mitigação: manter essa decisão explícita no payload e aplicar apenas via rota administrativa protegida.
- [Soft delete em usuário com histórico existente] -> Mitigação: usar `softDelete` para preservar relacionamentos.

## Migration Plan

1. Criar o módulo administrativo de usuários.
2. Expor as rotas sob `/admin/users`.
3. Registrar o ajuste manual de pontos no histórico.
4. Adicionar o módulo ao `AppModule`.

## Open Questions

- Se o produto passar a exigir paginação padronizada em todos os módulos, essa change pode evoluir para reutilizar um DTO compartilhado.
