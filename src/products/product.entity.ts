import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Cart } from '../cart/cart.entity';
import { OrderItem } from '../orders/order-item.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  product_id: number;

  @Column({ name: 'product_name' })
  product_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal')
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Cart, cart => cart.product)
  cart: Cart[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  order_items: OrderItem[];
}