/*
  NestJS bootstrap placeholder (Fastify).
  Dependencies will be added in subsequent tasks; this is structural scaffolding.
*/
import 'reflect-metadata';
import './otel-init';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from '@fastify/helmet';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    logger: { level: 'info' },
    genReqId: (req: any) => req.headers['x-request-id'] || Math.random().toString(16).slice(2),
  } as any);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook('onRequest', (req: any, reply: any, done: any) => {
    const id = req.id;
    reply.header('x-request-id', id);
    done();
  });
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  } as any);
  const config = new DocumentBuilder()
    .setTitle('Oui-Maître API')
    .setDescription('API du monde JDR (MVP)')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
  await app.listen({ port: 3000, host: '0.0.0.0' });
}

bootstrap();
