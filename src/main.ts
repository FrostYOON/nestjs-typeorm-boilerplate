import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create app
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Nest App Api Documentation')
    .setDescription('API documentation for the Nest App')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Global prefix
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'docs'],
  });

  // Start server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
