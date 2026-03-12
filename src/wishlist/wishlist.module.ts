// src/wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule }      from '@nestjs/typeorm';
import { WishlistService }    from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist }           from './wishlist.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([Wishlist])],
  controllers: [WishlistController],
  providers:   [WishlistService],
})
export class WishlistModule {}