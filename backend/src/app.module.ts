import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module'; // Single import for AuthModule
import { User } from './auth/user.entity/user.entity'; // Ensure correct path to User entity
import { SeedModule } from './seed/seed.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';
import { InventoryModule } from './inventory/inventory.module';
import { Inventory } from './inventory/inventory.entity';
import { DiscountModule } from './discount/discount.module';
import { Discount } from './discount/discount.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Replace with your DB host
      port: 5432, // Replace with your DB port
      username: 'postgres', // Replace with your DB username
      password: 'rakib08', // Replace with your DB password
      database: 'step_and_style', // Replace with your DB name
      entities: [User, Product, Inventory, Discount], // Register all entities here
      synchronize: true, // Auto syncs schema (don't use in production)
    }),
    AuthModule,
    SeedModule,
    ProductModule,
    InventoryModule,
    DiscountModule,
  ],
})
export class AppModule {}
