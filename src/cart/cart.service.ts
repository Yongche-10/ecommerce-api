// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
  ) {}

  findByUser(userId: number) {
    return this.cartRepo.find({
      where:     { user: { user_id: userId } },
      relations: ['product', 'product.category'],
    });
  }

  async upsert(userId: number, productId: number, quantity: number) {
    const existing = await this.cartRepo.findOne({
      where: { user: { user_id: userId }, product: { product_id: productId } },
    });
    if (existing) {
      existing.quantity = quantity;
      return this.cartRepo.save(existing);
    }
    const item = this.cartRepo.create({
      user:     { user_id: userId }       as any,
      product:  { product_id: productId } as any,
      quantity,
    });
    return this.cartRepo.save(item);
  }

  async remove(cartId: number, userId: number) {
    const item = await this.cartRepo.findOne({
      where: { cart_id: cartId, user: { user_id: userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    return this.cartRepo.remove(item);
  }

  async clear(userId: number) {
    const items = await this.cartRepo.find({
      where: { user: { user_id: userId } },
    });
    return this.cartRepo.remove(items);
  }
}