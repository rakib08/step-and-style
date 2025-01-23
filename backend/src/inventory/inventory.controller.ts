import { Controller, Get, Patch, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { RoleGuard } from '../auth/role.guard';
import { UserRole } from '../auth/user.entity/user.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Track all stock levels (Only Manager)
  @Get()
  @UseGuards(new RoleGuard(UserRole.MANAGER)) // Restrict to Manager
  async trackStockLevels() {
    return this.inventoryService.trackStockLevels();
  }

  // Get stock details for a specific product (Only Manager)
  @Get(':productId')
  @UseGuards(new RoleGuard(UserRole.MANAGER)) // Restrict to Manager
  async getInventoryByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.getInventoryByProduct(productId);
  }

  // Adjust stock for a specific product (Only Manager)
  @Patch(':productId/adjust')
  @UseGuards(new RoleGuard(UserRole.MANAGER)) // Restrict to Manager
  async adjustStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('stockAdjustment') stockAdjustment: number,
  ) {
    return this.inventoryService.adjustStock(productId, stockAdjustment);
  }

  // Reorder stock for a product (Only Manager)
  @Patch(':productId/reorder')
  @UseGuards(new RoleGuard(UserRole.MANAGER)) // Restrict to Manager
  async reorderStock(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.reorderStock(productId);
  }

  // Generate inventory report (Only Manager)
  @Get('report')
  @UseGuards(new RoleGuard(UserRole.MANAGER)) // Restrict to Manager
  async generateInventoryReport() {
    return this.inventoryService.generateInventoryReport();
  }
}
