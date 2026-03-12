// src/wishlist/wishlist.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User }    from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity({ name: 'wishlist' })
export class Wishlist {
  @PrimaryGeneratedColumn({ name: 'wishlist_id' })
  wishlist_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}