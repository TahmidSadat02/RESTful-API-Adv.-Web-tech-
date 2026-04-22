// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // Global validation pipe — applies to every route automatically
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // ↑ strips any extra fields not in the DTO
    forbidNonWhitelisted: true,
    // ↑ throws error if extra fields are sent
    transform: true,
    // ↑ auto-converts incoming data into DTO class instances
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Coffee Shop API')
    .setDescription('Backend API for Coffee Shop Management System')
    .setVersion('1.0')
    .addBearerAuth()
    // ↑ adds the Authorize button in Swagger for JWT testing
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ↑ Swagger UI will be at http://localhost:3000/api

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
  console.log('Swagger UI at http://localhost:3000/api');
}
bootstrap();