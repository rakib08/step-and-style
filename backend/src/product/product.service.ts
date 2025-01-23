import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(data: Partial<Product>, imagePaths: string[]) {
    const newProduct = this.productRepository.create({ ...data, images: imagePaths });
    return this.productRepository.save(newProduct);
  }

  async getAllProducts() {
    return this.productRepository.find();
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(id: number, data: Partial<Product>, imagePaths: string[]) {
    const product = await this.getProductById(id);
    const updatedProduct = Object.assign(product, data, { images: imagePaths });
    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);
    return this.productRepository.remove(product);
  }

  async bulkUpload(products: Partial<Product>[]) {
    const newProducts = this.productRepository.create(products);
    return this.productRepository.save(newProducts);
  }
}
