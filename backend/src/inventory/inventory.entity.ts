import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  product: Product;

  @Column('int')
  stock: number;

  @Column('int', { default: 10 })
  reorderLevel: number; // Minimum stock level before alerting

  @Column('int', { nullable: true })
  reorderQuantity: number; // Quantity to reorder when stock is low

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date; // Last stock adjustment date
}
