import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Product } from './product.entity';
import { Discount } from '../discount/discount.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
  ) {}

  // Create a new product
  async createProduct(data: Partial<Product>, imagePaths: string[]) {
    const newProduct = this.productRepository.create({ ...data, images: imagePaths });
    return this.productRepository.save(newProduct);
  }

  // Get all products
  async getAllProducts() {
    const products = await this.productRepository.find();

    // Check for active discounts for each product
    const now = new Date();
    for (const product of products) {
      const discount = await this.discountRepository.findOne({
        where: { product: { id: product.id }, startDate: LessThanOrEqual(now), endDate: MoreThanOrEqual(now) },
      });

      if (discount) {
        product.salePrice = this.calculateDiscountedPrice(product.price, discount);
      }
    }

    return products;
  }

  // Get product by ID
  async getProductById(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Check for an active discount for this product
    const now = new Date();
    const discount = await this.discountRepository.findOne({
      where: { product: { id }, startDate: LessThanOrEqual(now), endDate: MoreThanOrEqual(now) },
    });

    if (discount) {
      product.salePrice = this.calculateDiscountedPrice(product.price, discount);
    }

    return product;
  }

  // Update a product
  async updateProduct(id: number, data: Partial<Product>, imagePaths: string[]) {
    const product = await this.getProductById(id);
    const updatedProduct = Object.assign(product, data, { images: imagePaths });
    return this.productRepository.save(updatedProduct);
  }

  // Delete a product
  async deleteProduct(id: number) {
    const product = await this.getProductById(id);
    return this.productRepository.remove(product);
  }

  // Bulk upload products
  async bulkUpload(products: Partial<Product>[]) {
    const newProducts = this.productRepository.create(products);
    return this.productRepository.save(newProducts);
  }

  // Update pricing for a product
  async updatePricing(
    id: number,
    pricingData: { price: number; salePrice?: number; wholesalePrice?: number },
  ) {
    const product = await this.getProductById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Update pricing fields
    Object.assign(product, pricingData);
    return this.productRepository.save(product);
  }

  // Apply a discount (percentage-based or via coupon) to a product
  async applyDiscount(
    productId: number,
    discountType: 'percentage' | 'coupon',
    discountValue: number,
  ) {
    const product = await this.getProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (discountType === 'percentage') {
      // Apply a percentage-based discount
      product.salePrice = product.price - (product.price * discountValue) / 100;
    } else if (discountType === 'coupon') {
      // Apply a flat discount using coupon value
      product.salePrice = product.price - discountValue;
    }

    if (product.salePrice < 0) {
      product.salePrice = 0; // Ensure no negative pricing
    }

    return this.productRepository.save(product);
  }

  // Apply discounts to a specific product or category
  async applyDiscountToProductOrCategory(productId?: number, category?: string) {
    const now = new Date();

    if (productId) {
      // Check for active discounts for the specific product
      const discount = await this.discountRepository.findOne({
        where: { product: { id: productId }, startDate: LessThanOrEqual(now), endDate: MoreThanOrEqual(now) },
      });

      if (discount) {
        return this.applyDiscount(productId, 'percentage', discount.percentage ?? 0);
      }
    }

    if (category) {
      // Check for active discounts for the category
      const discount = await this.discountRepository.findOne({
        where: { category, startDate: LessThanOrEqual(now), endDate: MoreThanOrEqual(now) },
      });

      if (discount) {
        const products = await this.productRepository.find({ where: { category } });

        for (const product of products) {
          await this.applyDiscount(product.id, 'percentage', discount.percentage ?? 0);
        }

        return products;
      }
    }

    throw new NotFoundException('No active discounts found for this product or category');
  }

  // Helper function to calculate discounted price
  private calculateDiscountedPrice(price: number, discount: Discount): number {
    if (discount.percentage) {
      return price - (price * discount.percentage) / 100;
    } else if (discount.flatAmount) {
      return Math.max(0, price - discount.flatAmount); // Ensure no negative pricing
    }
    return price;
  }
}
