## Context

A API do domy-api está quase completa em termos de features e agora precisa de uma documentação sólida. Como estamos utilizando o NestJS, o uso do pacote oficial `@nestjs/swagger` é o padrão ouro da comunidade. Ele nos permite gerar uma documentação viva a partir da própria base de código (decorators em controllers e DTOs) garantindo que a especificação não fique defasada em relação à implementação.

## Goals / Non-Goals

**Goals:**
- Configurar o `@nestjs/swagger` para servir a interface Swagger UI localmente.
- Adicionar documentação em todos os endpoints, incluindo tags, resumos de operação e respostas possíveis (sucesso e erro).
- Tipar todos os DTOs de request e response utilizando `@ApiProperty()`.
- Prover uma forma automatizada de exportar o arquivo `openapi.yaml` (ex: script custom).
- Atualizar as configurações do OpenSpec (se aplicável).

**Non-Goals:**
- Testes E2E adicionais para verificar a conformidade do schema gerado no momento (apenas a geração do yaml é escopo).
- Criação de clientes (SDKs) para o frontend (será feito no frontend com base no yaml gerado).

## Decisions

1. **Uso de Decorators do Swagger no código fonte**
   - **Por quê?** O NestJS integra-se nativamente com o Swagger. Usar os decorators nos controllers (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) e nos DTOs (`@ApiProperty`) garante que a documentação da API seja gerada de forma dinâmica baseada no código.
   - **Alternativas:** Escrever o YAML manualmente e apenas servi-lo estaticamente. Seria difícil de manter atualizado com as mudanças no código.

2. **Exposição do Swagger UI apenas fora de produção**
   - **Por quê?** Segurança. Evitar exposição desnecessária da documentação da API em ambiente produtivo, já que é uma API para consumo interno de aplicativos próprios (mobile/web).
   - **Alternativas:** Exigir autenticação básica no `/api/docs` em produção, mas o mais simples é apenas inativá-lo via flag de ambiente (`NODE_ENV`).

3. **Script separado para geração do YAML**
   - **Por quê?** Precisamos exportar fisicamente o arquivo para uso por outras ferramentas (frontend para gerar clientes e validar OpenSpec). A forma recomendada no ecossistema NestJS é um script standalone (`src/swagger-gen.ts`) que faz bootstrap apenas do módulo da aplicação com o wrapper do Swagger e escreve o JSON/YAML resultante para o File System.
   - **Alternativas:** Um plugin CLI que exporta no build, ou uma rota GET `/api/docs-yaml`. Ter um arquivo físico no controle de versão (ou gerado no CI) é mais prático.

## Risks / Trade-offs

- [Risk] Decorators poluindo excessivamente os controllers e DTOs → [Mitigation] O NestJS Swagger CLI plugin pode ser ativado no `nest-cli.json` para inferir tipos automaticamente sem necessidade de preencher `@ApiProperty` em todos os campos, minimizando drasticamente a poluição nos DTOs.
