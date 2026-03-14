// src/orders/orders.controller.ts
import {
  Controller, Get, Post, Patch,
  Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard }  from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders — customer places an order
  // Body: { total, items: [{ product_id, quantity, price }] }
  @Post()
  create(@Request() req, @Body() body: any) {
    return this.ordersService.create(
      req.user.userId,
      body.total,
      body.items ?? [],
    );
  }

  // GET /orders/all — admin: see all customer orders
  @Get('all')
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /orders — customer: their own orders
  @Get()
  findMine(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  // GET /orders/:id — single order detail
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // PATCH /orders/:id/status — admin: update order status
  // Body: { status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled' }
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(+id, body.status);
  }
}