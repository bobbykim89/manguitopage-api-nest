import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as multipart from '@fastify/multipart';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 1024 * 1024 * 10,
      files: 1,
    },
  });
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
