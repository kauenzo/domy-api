## ADDED Requirements

### Requirement: Autenticacao de membro via Google OAuth
O sistema SHALL disponibilizar um fluxo de autenticação de membro em `/auth/google` e `/auth/google/callback` usando Google OAuth e SHALL emitir um par de tokens JWT ao concluir o callback com sucesso.

#### Scenario: Iniciar login de membro
- **WHEN** um visitante acessar `POST /auth/google`
- **THEN** o sistema MUST redirecionar para o fluxo do Google com escopos de autenticação apropriados para identidade e perfil

#### Scenario: Callback bem-sucedido autentica o membro
- **WHEN** o Google retornar ao `GET /auth/google/callback` com dados válidos
- **THEN** o sistema MUST localizar ou criar o usuário membro correspondente
- **THEN** o sistema MUST emitir `accessToken` e `refreshToken`
- **THEN** o sistema MUST registrar a sessão para permitir renovação posterior

#### Scenario: Conta existente é reaproveitada
- **WHEN** o usuário já existir no banco
- **THEN** o sistema MUST reutilizar o registro existente
- **THEN** o sistema MUST atualizar dados de perfil relevantes quando fornecidos pelo provedor

### Requirement: Ciclo de vida da sessao de membro
O sistema SHALL permitir renovação e revogação de sessão de membro por meio de `/auth/refresh` e `/auth/logout`, armazenando o refresh token apenas como hash persistido.

#### Scenario: Renovacao gera novos tokens
- **WHEN** um membro enviar um refresh token valido para `POST /auth/refresh`
- **THEN** o sistema MUST validar o hash armazenado
- **THEN** o sistema MUST emitir novos `accessToken` e `refreshToken`
- **THEN** o sistema MUST rotacionar o refresh token persistido

#### Scenario: Logout revoga a sessao
- **WHEN** um membro acessar `POST /auth/logout`
- **THEN** o sistema MUST marcar o refresh token correspondente como revogado
- **THEN** o mesmo refresh token MUST fail em tentativas futuras de renovacao

#### Scenario: Refresh token invalido e rejeitado
- **WHEN** um refresh token expirado, revogado ou desconhecido for enviado
- **THEN** o sistema MUST responder com falha de autenticacao

### Requirement: Perfil autenticado do membro
O sistema SHALL expor `GET /auth/me` para retornar os dados do usuário autenticado e SHALL proteger essa rota com autenticação JWT.

#### Scenario: Usuário autenticado obtém seu perfil
- **WHEN** uma requisição válida com access token autenticar o usuário
- **THEN** o sistema MUST responder com os dados do usuário associado ao token

#### Scenario: Requisição sem token é negada
- **WHEN** `GET /auth/me` for chamado sem access token válido
- **THEN** o sistema MUST responder com `401`

### Requirement: Vinculo de convite no callback
O sistema SHALL aceitar `invite` na callback de autenticação de membro e SHALL vincular o convite ao usuário criado ou autenticado quando o token for válido.

#### Scenario: Convite válido é consumido no login
- **WHEN** o callback receber `invite=<token>` com token valido, nao expirado e nao usado
- **THEN** o sistema MUST associar o convite ao usuário autenticado
- **THEN** o sistema MUST marcar o convite como usado

#### Scenario: Convite invalido bloqueia o vinculo
- **WHEN** o callback receber um token expirado, usado ou inexistente
- **THEN** o sistema MUST rejeitar o vínculo do convite
- **THEN** o sistema MUST manter a autenticacao do usuario consistente
