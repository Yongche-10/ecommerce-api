// src/wishlist/wishlist.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishRepo: Repository<Wishlist>,
  ) {}

  findByUser(userId: number) {
    return this.wishRepo.find({
      where:     { user: { user_id: userId } },
      relations: ['product', 'product.category'],
    });
  }

  async add(userId: number, productId: number) {
    const existing = await this.wishRepo.findOne({
      where: { user: { user_id: userId }, product: { product_id: productId } },
    });
    if (existing) return existing;
    const item = this.wishRepo.create({
      user:    { user_id: userId }       as any,
      product: { product_id: productId } as any,
    });
    return this.wishRepo.save(item);
  }

  async remove(wishlistId: number, userId: number) {
    const item = await this.wishRepo.findOne({
      where: { wishlist_id: wishlistId, user: { user_id: userId } },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');
    return this.wishRepo.remove(item);
  }
}