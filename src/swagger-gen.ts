/**
 * Script de geração do arquivo openapi.yaml.
 *
 * Uso: npm run swagger:gen
 * Gera o arquivo openapi.yaml na raiz do projeto com a spec OpenAPI completa.
 */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { join } from 'path';
import { AppModule } from './app.module';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('domy-api')
    .setDescription('API do app doméstico gamificado')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputPath = join(process.cwd(), 'openapi.yaml');
  writeFileSync(outputPath, dump(document, { indent: 2 }), 'utf8');

  console.log(`✅ openapi.yaml gerado em: ${outputPath}`);
  await app.close();
}

generateSwagger().catch((err) => {
  console.error('Erro ao gerar o schema OpenAPI:', err);
  process.exit(1);
});
