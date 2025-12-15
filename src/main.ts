import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

   app.enableCors({
    origin: [
      'https://taka-ai.netlify.app/',
      'http://localhost:5173', // URL del frontend en desarrollo (Vite)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // si necesitás enviar cookies o headers de autenticación
  });

 app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // convierte automáticamente tipos según el DTO
  }));  


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
