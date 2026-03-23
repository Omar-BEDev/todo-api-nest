import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
let app;
async function bootstrap() {
   app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist : true,
    transform : true
  }))
  app.use(helmet)
  await app.listen(process.env.PORT ?? 3000);

}
export default app
bootstrap();
