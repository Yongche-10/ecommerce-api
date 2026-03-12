// src/cart/cart.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User }    from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn({ name: 'cart_id' })
  cart_id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}