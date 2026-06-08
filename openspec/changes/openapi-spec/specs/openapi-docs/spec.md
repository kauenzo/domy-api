## ADDED Requirements

### Requirement: Swagger UI habilitado em desenvolvimento
O sistema MUST expor a interface do Swagger UI no endpoint `/api/docs` quando não estiver rodando em ambiente de produção (`NODE_ENV !== 'production'`).

#### Scenario: Acesso em desenvolvimento
- **WHEN** o usuário acessa `/api/docs` no browser com `NODE_ENV=development`
- **THEN** a interface interativa do Swagger UI é renderizada contendo todos os endpoints da API documentados

#### Scenario: Acesso bloqueado em produção
- **WHEN** o usuário acessa `/api/docs` no browser com `NODE_ENV=production`
- **THEN** a rota não deve estar registrada e o sistema deve retornar 404 Not Found

### Requirement: Documentação via Decorators em Controllers
Todos os controllers MUST possuir decorators `@ApiTags()`, e cada rota MUST possuir `@ApiOperation()` e pelo menos as respostas mapeadas em `@ApiResponse()`. Rotas protegidas MUST indicar a autenticação (`@ApiBearerAuth()`).

#### Scenario: Visualização do Endpoint de Perfil
- **WHEN** o Swagger lê o `ProfileController`
- **THEN** ele agrupa a rota sob a tag "Profile", exige autenticação "bearer", detalha que retorna os dados atualizados e apresenta os códigos de resposta HTTP corretos.

### Requirement: Documentação de DTOs
Todos os Data Transfer Objects (DTOs) usados como requests ou responses MUST ter as propriedades exportadas para a documentação via `@ApiProperty()` (ou inferidas através do plugin CLI do NestJS, se ativado).

#### Scenario: Schema de entrada no Swagger UI
- **WHEN** o usuário visualiza um endpoint com corpo de request
- **THEN** o schema JSON correspondente é exibido no Swagger UI, com tipagem correta e se as propriedades são obrigatórias ou opcionais definidas nos DTOs

### Requirement: Exportação do YAML estático
O projeto MUST prover um script que constrói a especificação OpenAPI e a salva como um arquivo `openapi.yaml` na raiz do projeto.

#### Scenario: Geração do arquivo OpenAPI
- **WHEN** o script de geração (ex: `swagger-gen`) é executado
- **THEN** o arquivo `openapi.yaml` é escrito fisicamente com o schema atualizado e pronto para ser consumido
