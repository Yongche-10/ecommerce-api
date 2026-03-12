// src/cart/cart.controller.ts
import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { CartService }  from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // GET /cart
  @Get()
  findAll(@Request() req) {
    return this.cartService.findByUser(req.user.userId);
  }

  // POST /cart  { product_id, quantity }
  @Post()
  upsert(@Request() req, @Body() body: any) {
    return this.cartService.upsert(req.user.userId, body.product_id, body.quantity ?? 1);
  }

  // DELETE /cart/:id
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    return this.cartService.remove(+id, req.user.userId);
  }

  // DELETE /cart  (clear all)
  @Delete()
  clear(@Request() req) {
    return this.cartService.clear(req.user.userId);
  }
}