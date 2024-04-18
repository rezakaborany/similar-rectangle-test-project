import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule);
  // Set the global prefix here
  app.setGlobalPrefix('api');
  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Api')
    .setDescription('Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  await app.listen(process.env.APP_PORT);
  console.log(`app is running at ${process.env.APP_PORT}`)
}
bootstrap();
