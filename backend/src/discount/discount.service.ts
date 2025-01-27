import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';
import { Product } from '../product/product.entity';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';


@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Create a discount for a product or category
  async createDiscount(discountData: Partial<Discount>) {
    const discount = this.discountRepository.create(discountData);

    if (discountData.product) {
      const product = await this.productRepository.findOne({
        where: { id: discountData.product.id },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      discount.product = product;
    }

    return this.discountRepository.save(discount);
  }

  // Apply discount to a specific product or category
  async applyDiscountToProductOrCategory(productId?: number, category?: string) {
    const now = new Date();

    // Check for active discounts on the product
    if (productId) {
      const discount = await this.discountRepository.findOne({
        where: { product: { id: productId }, startDate: LessThanOrEqual(now), endDate: MoreThanOrEqual(now) },
      });

      if (discount) {
        return this.applyDiscount(productId, discount);
      }
    }

    // Check for active discounts on the category
    if (category) {
      const discount = await this.discountRepository.findOne({
        where: { category, startDate: LessThanOrEqual(now), endDate: MoreThanOrEqual(now) },
      });

      if (discount) {
        const products = await this.productRepository.find({ where: { category } });

        for (const product of products) {
          await this.applyDiscount(product.id, discount);
        }

        return products;
      }
    }

    throw new NotFoundException('No active discounts found for this product or category');
  }

  // Apply a discount to a product
  private async applyDiscount(productId: number, discount: Discount) {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (discount.percentage) {
      product.salePrice = product.price - (product.price * discount.percentage) / 100;
    } else if (discount.flatAmount) {
      product.salePrice = product.price - discount.flatAmount;
    }

    if (product.salePrice < 0) {
      product.salePrice = 0; // Ensure no negative pricing
    }

    return this.productRepository.save(product);
  }
}
