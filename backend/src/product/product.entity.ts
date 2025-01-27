import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column('decimal')
  price: number; // Regular price

  @Column('decimal', { nullable: true })
  salePrice: number; // Sale price

  @Column('decimal', { nullable: true })
  wholesalePrice: number; // Wholesale price

  @Column('int')
  quantity: number;

  @Column({ unique: true })
  sku: string;

  @Column('simple-array', { nullable: true })
  images: string[]; // Stores image paths as an array

  @Column({ default: true })
  isActive: boolean; // Marks product as active/inactive
}
