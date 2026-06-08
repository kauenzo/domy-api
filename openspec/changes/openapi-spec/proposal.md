## Why

Para garantir uma integração fácil e correta entre o frontend (ou outros clientes) e a API, é fundamental termos uma documentação clara e uma especificação formal (OpenAPI/Swagger) atuando como a única fonte de verdade para os endpoints disponíveis. 

## What Changes

- Adição dos decorators do `@nestjs/swagger` em todos os controllers da aplicação (como `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiBearerAuth()`).
- Inclusão do decorator `@ApiProperty()` em todos os DTOs utilizados para detalhar as requisições e respostas.
- Configuração do Swagger UI acessível em `/api/docs`, disponível apenas quando `NODE_ENV !== 'production'`.
- Criação de um script `nest start --entryFile swagger-gen` para exportar fisicamente o arquivo `openapi.yaml`.
- Configuração do contexto do projeto no `openspec/config.yaml`.

## Capabilities

### New Capabilities
- `openapi-docs`: Geração de especificação OpenAPI (Swagger) e documentação interativa para todos os endpoints da API.

### Modified Capabilities

## Impact

- **Código**: Todos os Controllers e DTOs existentes serão modificados para receber os decorators de documentação. O arquivo `main.ts` será alterado para expor o Swagger UI.
- **Processos**: Novo script adicionado para exportar o schema YAML via `swagger-gen`.
- **Integração**: Frontend poderá utilizar o `openapi.yaml` gerado para auto-gerar clientes de API ou validar requisições.
