import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async trackStockLevels() {
    return this.inventoryRepository.find({ relations: ['product'] });
  }

  async getInventoryByProduct(productId: number) {
    const inventory = await this.inventoryRepository.findOne({
      where: { product: { id: productId } },
      relations: ['product'],
    });
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  async adjustStock(productId: number, stockAdjustment: number) {
    const inventory = await this.getInventoryByProduct(productId);
    inventory.stock += stockAdjustment;
    inventory.lastUpdated = new Date();
    return this.inventoryRepository.save(inventory);
  }

  async reorderStock(productId: number) {
    const inventory = await this.getInventoryByProduct(productId);
    if (inventory.stock < inventory.reorderLevel && inventory.reorderQuantity) {
      inventory.stock += inventory.reorderQuantity;
      inventory.lastUpdated = new Date();
      return this.inventoryRepository.save(inventory);
    } else {
      throw new Error('Stock level is sufficient or reorder quantity is not set');
    }
  }

  async generateInventoryReport() {
    return this.inventoryRepository.find({ relations: ['product'] });
  }
}
