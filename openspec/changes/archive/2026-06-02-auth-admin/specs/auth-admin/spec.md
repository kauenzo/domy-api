## ADDED Requirements

### Requirement: Autenticacao de admin via Google OAuth
O sistema SHALL disponibilizar um fluxo de autenticação administrativa em `/admin/auth/google` e `/admin/auth/google/callback` usando Google OAuth e SHALL emitir um par de tokens JWT ao concluir o callback com sucesso.

#### Scenario: Iniciar login administrativo
- **WHEN** um visitante acessar `POST /admin/auth/google`
- **THEN** o sistema MUST redirecionar para o fluxo do Google com escopos de identidade e perfil

#### Scenario: Callback bem-sucedido autentica o admin
- **WHEN** o Google retornar ao `GET /admin/auth/google/callback` com dados válidos
- **THEN** o sistema MUST localizar ou criar o usuário correspondente
- **THEN** o sistema MUST validar se o usuário possui role `admin`
- **THEN** o sistema MUST emitir `accessToken` e `refreshToken` apenas se a role estiver presente

### Requirement: Acesso sem role admin e rejeitado
O sistema SHALL rejeitar qualquer tentativa de autenticação administrativa quando o usuário autenticado não possuir role `admin`.

#### Scenario: Usuário sem role admin recebe 403
- **WHEN** um usuário autenticado sem role `admin` concluir o callback administrativo
- **THEN** o sistema MUST responder com `403`
- **THEN** o sistema MUST não emitir tokens administrativos
    
#### Scenario: Role removida invalida renovacao
- **WHEN** um refresh token administrativo for apresentado por um usuário que perdeu a role `admin`
- **THEN** o sistema MUST negar a renovação
- **THEN** o sistema MUST exigir nova autenticação válida com role admin

### Requirement: Ciclo de vida da sessao administrativa
O sistema SHALL permitir renovação e revogação de sessão administrativa por meio de `/admin/auth/refresh` e `/admin/auth/logout`, armazenando o refresh token apenas como hash persistido.

#### Scenario: Renovacao administrativa gera novos tokens
- **WHEN** um admin enviar um refresh token valido para `POST /admin/auth/refresh`
- **THEN** o sistema MUST validar o hash armazenado
- **THEN** o sistema MUST revalidar a role `admin`
- **THEN** o sistema MUST emitir novos `accessToken` e `refreshToken`

#### Scenario: Logout administrativo revoga a sessao
- **WHEN** um admin acessar `POST /admin/auth/logout`
- **THEN** o sistema MUST marcar o refresh token correspondente como revogado
- **THEN** o mesmo refresh token MUST fail em tentativas futuras de renovacao
