## ADDED Requirements

### Requirement: Member Profile Retrieval
O sistema MUST retornar o perfil e as estatísticas do usuário logado.

#### Scenario: Visualizando o próprio perfil
- **WHEN** um membro autenticado faz uma requisição GET para `/profile`
- **THEN** o sistema retorna seus dados pessoais (nome, avatar) junto com estatísticas consolidadas (saldo de pontos, streak atual, streak máximo, nível atual e contagem de tarefas totais concluídas).

### Requirement: Member Profile Update
O sistema MUST permitir que o usuário atualize suas informações básicas de forma segura.

#### Scenario: Atualizando o próprio perfil
- **WHEN** um membro autenticado faz uma requisição PATCH para `/profile` enviando os atributos `name` e/ou `avatar_url` válidos
- **THEN** o sistema salva as alterações e retorna os dados atualizados do perfil.
