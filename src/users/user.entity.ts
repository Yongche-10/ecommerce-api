// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order }    from '../orders/order.entity';
import { Cart }     from '../cart/cart.entity';
import { Wishlist } from '../wishlist/wishlist.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'photo_url', nullable: true })
  photo_url: string;

  @Column({ type: 'enum', enum: ['customer', 'admin'], default: 'customer' })
  role: 'customer' | 'admin';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Order,    order => order.user)
  orders: Order[];

  @OneToMany(() => Cart,     cart => cart.user)
  cart: Cart[];

  @OneToMany(() => Wishlist, wish => wish.user)
  wishlist: Wishlist[];
}