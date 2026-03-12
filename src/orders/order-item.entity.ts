// src/orders/order-item.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order }   from './order.entity';
import { Product } from '../products/product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'order_item_id' })
  order_item_id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}