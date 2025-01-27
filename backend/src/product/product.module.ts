import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DiscountModule } from '../discount/discount.module'; 
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, DiscountModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
