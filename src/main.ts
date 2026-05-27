import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { DecryptMobileInterceptor } from './common/interceptors/decrypt-mobile.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new DecryptMobileInterceptor());
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
