// src/wishlist/wishlist.controller.ts
import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard }    from '../auth/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // GET /wishlist
  @Get()
  findAll(@Request() req) {
    return this.wishlistService.findByUser(req.user.userId);
  }

  // POST /wishlist  { product_id }
  @Post()
  add(@Request() req, @Body() body: any) {
    return this.wishlistService.add(req.user.userId, body.product_id);
  }

  // DELETE /wishlist/:id
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    return this.wishlistService.remove(+id, req.user.userId);
  }
}