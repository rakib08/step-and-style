import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Unique coupon code

  @Column('decimal', { nullable: true })
  percentage: number; // Percentage discount (e.g., 10%)

  @Column('decimal', { nullable: true })
  flatAmount: number; // Flat discount (e.g., $20 off)

  @Column('timestamp')
  startDate: Date; // Start of discount validity

  @Column('timestamp')
  endDate: Date; // End of discount validity

  @ManyToOne(() => Product, (product) => product.id, { nullable: true, onDelete: "SET NULL"
   })
  product: Product; // Apply to a specific product

  @Column({ nullable: true })
  category: string; // Apply to a specific category (optional)
}
