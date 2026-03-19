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

  @Post()
  create(@Request() req, @Body() body: any) {
    return this.ordersService.create(
      req.user.userId,
      body.total,
      body.items ?? [],
      body.address,
      body.phone,
    );
  }

  @Get('all')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get()
  findMine(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(+id, body.status);
  }
}