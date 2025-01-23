import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Track all stock levels
  @Get()
  async trackStockLevels() {
    return this.inventoryService.trackStockLevels();
  }

  // Get stock details for a specific product
  @Get(':productId')
  async getInventoryByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.getInventoryByProduct(productId);
  }

  // Adjust stock for a specific product
  @Patch(':productId/adjust')
  async adjustStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('stockAdjustment') stockAdjustment: number,
  ) {
    return this.inventoryService.adjustStock(productId, stockAdjustment);
  }

  // Reorder stock for a product
  @Patch(':productId/reorder')
  async reorderStock(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.reorderStock(productId);
  }

  // Generate inventory report
  @Get('report')
  async generateInventoryReport() {
    return this.inventoryService.generateInventoryReport();
  }
}
