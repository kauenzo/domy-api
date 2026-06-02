## Context

Esta change implementa o fluxo de autenticação de membro descrito no roadmap da fase `auth-member`. A base de infraestrutura, banco e entidades já está disponível, então o foco aqui é a superfície de autenticação, o ciclo de vida da sessão e a integração com convites.

O módulo precisa conviver com a futura autenticação de admin sem ambiguidades de rota ou autorização. Também precisa permanecer alinhado às convenções do projeto: NestJS modular, TypeORM, JWT curto com refresh longo e persistência de refresh token em banco.

## Goals / Non-Goals

**Goals:**
- Autenticar membros via Google OAuth.
- Emitir access token e refresh token para sessão de membro.
- Armazenar refresh token com hash e permitir revogação.
- Expor endpoint para renovar sessão e endpoint para logout.
- Expor endpoint autenticado para retornar o usuário atual.
- Vincular convite quando o callback receber `invite`.

**Non-Goals:**
- Autenticação administrativa.
- UI/UX do frontend de login.
- Regras de negócio de tarefas, pontos ou recompensas.
- Gerenciamento completo de convites além do vínculo no callback.

## Decisions

### 1. Manter o fluxo de membro isolado em `src/modules/auth`
Separar o módulo de membro evita colisão com o fluxo admin e mantém o contrato das rotas previsível. Uma pasta dedicada também simplifica os imports e reduz o risco de reutilizar sem querer comportamento administrativo em rotas públicas.

Alternativas consideradas:
- Unificar em um módulo único com flags de role.
- Rejeitado porque aumenta acoplamento e deixa as rotas menos explícitas.

### 2. Persistir apenas hash do refresh token
O refresh token deve ser armazenado como hash em `refresh_tokens` para reduzir impacto em caso de vazamento do banco. O token bruto só existe no momento da emissão e da rotação.

Alternativas consideradas:
- Armazenar o token em texto puro.
- Rejeitado porque aumenta o impacto de exposição do banco.

### 3. Rotacionar refresh token em cada renovação
Cada chamada bem-sucedida de `/auth/refresh` deve invalidar o token anterior e emitir um novo par de tokens. Isso reduz reutilização indevida e melhora a capacidade de revogação.

Alternativas consideradas:
- Reutilizar sempre o mesmo refresh token até expirar.
- Rejeitado porque dificulta auditoria e revogação granular.

### 4. Retornar tokens no corpo da resposta
O backend vai responder com JSON contendo `accessToken` e `refreshToken`. Isso mantém o contrato independente de navegador, facilita consumo por app móvel e evita impor cookie strategy antes da camada de frontend estar consolidada.

Alternativas consideradas:
- Usar cookies HttpOnly.
- Rejeitado neste momento por exigir decisões adicionais de domínio, CORS e CSRF.

### 5. Validar convite dentro da transação de login
Se o callback vier com `invite`, a validação do token e o vínculo com o usuário criado devem acontecer no mesmo fluxo transacional. Isso evita que um convite seja marcado como usado sem a criação bem-sucedida da conta.

Alternativas consideradas:
- Fazer o vínculo em job assíncrono.
- Rejeitado porque pode deixar convites em estado inconsistente.

## Risks / Trade-offs

- [Vazamento do refresh token no cliente] -> Mitigação: usar hash no banco, rotação em refresh e expiração curta/longa bem definida.
- [Convite usado em corrida concorrente] -> Mitigação: validar e consumir o convite em operação transacional com lock adequado.
- [Diferença entre sessão de membro e admin] -> Mitigação: manter módulos e rotas separados desde o início.
- [Dependência do Google OAuth para testes locais] -> Mitigação: usar mocks e testes focados em service/controller, com integração limitada aos fluxos críticos.

## Migration Plan

1. Registrar o módulo de auth e as estratégias no módulo principal da aplicação.
2. Configurar variáveis de ambiente de Google OAuth e JWT no ambiente de desenvolvimento e homologação.
3. Validar que a tabela `refresh_tokens` está disponível e mapeada pela entity existente.
4. Publicar a change sem alterar contratos de módulos futuros.
5. Se houver falha em produção, desabilitar as rotas de auth do módulo e reter os dados de sessão existentes para análise.

## Open Questions

- Nenhuma pendência técnica crítica no momento.
