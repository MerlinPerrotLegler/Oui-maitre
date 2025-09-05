/*
  NestJS bootstrap placeholder (Fastify).
  Dependencies will be added in subsequent tasks; this is structural scaffolding.
*/
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.listen({ port: 3000, host: '0.0.0.0' });
}

bootstrap();

