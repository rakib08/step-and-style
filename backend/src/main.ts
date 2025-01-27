import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with explicit origin and credentials
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend origin
    credentials: true, // Allow credentials (cookies)
  });

  // app.enableCors({
  //   origin: '*', // Allow all origins
  // });
  

  // Get SeedService and run the seeder
  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(3001);
}
bootstrap();
