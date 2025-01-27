import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './discount.entity';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, Product])],
  providers: [DiscountService],
  controllers: [DiscountController],
  exports: [TypeOrmModule] // Export TypeOrmModule to share DiscountRepository
})
export class DiscountModule {}
