import { Controller, Post, Get, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/role.guard';
import { UserRole } from '../auth/user.entity/user.entity';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // Create a new discount (Only Manager)
  @Post('create')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.MANAGER))
  async createDiscount(@Body() discountData: any) {
    return this.discountService.createDiscount(discountData);
  }

  // Apply discount to a product or category (Only Manager)
  @Patch('apply')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.MANAGER))
  async applyDiscountToProductOrCategory(
    @Body() body: { productId?: number; category?: string },
  ) {
    const { productId, category } = body;
    return this.discountService.applyDiscountToProductOrCategory(productId, category);
  }
}
