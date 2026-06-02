## Context

A Fase 1 foca na fundação da arquitetura de dados do domy-api. O projeto utilizará PostgreSQL 16 com TypeORM no NestJS. É necessário mapear todas as entidades baseadas nos requisitos (como `users`, `tasks`, `point_transactions`, `rewards`, `redemptions`, etc.) antes de qualquer regra de negócio ou lógica de autenticação.

## Goals / Non-Goals

**Goals:**
- Traduzir a modelagem de dados teórica (`back-speck.md`) em código (Entities do TypeORM).
- Garantir a padronização: `snake_case` nas colunas do banco e camelCase nas propriedades da classe.
- Definir corretamente relacionamentos (OneToMany, ManyToOne) e soft delete nativo (`@DeleteDateColumn()`).
- Suportar tipos de dados complexos do PostgreSQL como `jsonb` e `enum[]` quando apropriado.

**Non-Goals:**
- Criação e execução de Migrations (é a Fase 2).
- Construção de endpoints (fases posteriores).
- Lógica de Jobs Cron (Fase 12).

## Decisions

1. **Uso explícito de nomes de colunas**: Adotaremos `@Column({ name: 'snake_case' })` para todas as colunas para evitar incompatibilidades caso a estratégia de nomeação do TypeORM não atenda 100% dos casos ou seja alterada.
2. **Uso do tipo JSONB no PostgreSQL**: O campo `recurrence_config` na tabela `task_templates` utilizará o tipo `jsonb` para flexibilidade na parametrização de agendamentos.
3. **Array de Enums no PostgreSQL**: Para o array de `roles` em `users`, utilizaremos array de enum ou `varchar[]` / `enum[]` compatível com PG e TypeORM.
4. **Soft Delete Global**: Optamos por habilitar soft delete em entidades principais (`users`, `task_templates`, `categories`, `rewards`) preservando integridade referencial.
5. **UUID**: Chaves primárias em formato UUID v4 (`@PrimaryGeneratedColumn('uuid')`).

## Risks / Trade-offs

- **[Risk] Complexidade e integridade no JSONB (`recurrence_config`)** → **Mitigation**: A validação do conteúdo do JSONB será responsabilidade de DTOs (na camada de transporte / aplicação) através do `class-validator` nas fases seguintes, já que o banco não aplica esquema estrito nele.
- **[Risk] Crescimento do banco com Soft Delete** → **Mitigation**: É um app doméstico, o volume de deleções não justificará purgas elaboradas neste estágio. A integridade de logs (quem resgatou, tarefas realizadas) supera o pequeno custo de armazenamento.
