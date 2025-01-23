import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get SeedService and run the seeder
  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(3000);
}
bootstrap();
