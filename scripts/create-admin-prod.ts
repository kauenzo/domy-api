import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

// Carregar variáveis de ambiente do .env.prod
dotenv.config({ path: path.resolve(process.cwd(), '.env.prod') });

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  console.error('Erro: Variáveis de ambiente do banco de dados de produção (.env.prod) não encontradas.');
  process.exit(1);
}

// Senha opcional fornecida via argumento da linha de comando ou variável de ambiente
const inputPassword = 'kaue0751';

async function run() {
  const client = new Client({
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT || 5432),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false // Necessário para conexões seguras com o Supabase
    }
  });

  try {
    let hashedPassword = null;
    if (inputPassword) {
      console.log('Senha fornecida. Gerando hash com bcrypt...');
      hashedPassword = await bcrypt.hash(inputPassword, 10);
      console.log('Senha hash:', hashedPassword)
    } else {
      console.log('Nenhuma senha fornecida. O usuário será criado sem senha (ou manterá a senha atual se já existir).');
    }

    console.log(`Conectando ao banco de dados de produção (${DATABASE_HOST})...`);
    await client.connect();
    console.log('Conectado com sucesso!');

    const query = `
      INSERT INTO "users" (
        "id", 
        "created_at", 
        "updated_at", 
        "deleted_at", 
        "google_id", 
        "name", 
        "email", 
        "avatar_url", 
        "roles", 
        "points_balance", 
        "current_streak", 
        "longest_streak", 
        "level", 
        "is_active",
        "password"
      ) VALUES (
        $1, 
        $2, 
        $3, 
        NULL, 
        $4, 
        $5, 
        $6, 
        NULL, 
        ARRAY['member', 'admin']::"users_roles_enum"[], 
        $7, 
        $8, 
        $9, 
        $10::"users_level_enum", 
        $11,
        $12
      )
      ON CONFLICT ("id") DO UPDATE SET 
        "roles" = ARRAY['member', 'admin']::"users_roles_enum"[],
        "is_active" = true,
        "password" = COALESCE($12, "users"."password"),
        "updated_at" = NOW()
      RETURNING *;
    `;

    const values = [
      '6bc5bc69-874f-4dde-a765-42fe154ddd73', // id
      '2026-06-13 02:01:08.151',              // created_at
      '2026-06-13 21:40:12.145',              // updated_at
      '6bc5bc69-874f-4dde-a765-42fe154ddd73', // google_id
      'Kaue elias',                           // name
      'dev.kaue@icloud.com',                  // email
      0,                                      // points_balance
      0,                                      // current_streak
      0,                                      // longest_streak
      'Bronze',                               // level
      true,                                   // is_active
      hashedPassword                          // password (hash)
    ];

    console.log('Inserindo/atualizando usuário admin...');
    const res = await client.query(query, values);
    console.log('Operação concluída com sucesso!');
    console.log('Dados do usuário atualizados/criados:', {
      ...res.rows[0],
      password: res.rows[0].password ? '[PROTECTED]' : null
    });
  } catch (err) {
    console.error('Erro ao executar o script no banco de produção:', err);
  } finally {
    await client.end();
  }
}

run();
