// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order }     from './order.entity';
import { OrderItem } from './order-item.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    private notificationsService: NotificationsService,
  ) {}

  async create(userId: number, total: number, items: { product_id: number; quantity: number; price: number }[]) {
    const order = this.orderRepo.create({
      user:   { user_id: userId } as any,
      total,
      status: 'pending',
    });
    const savedOrder = await this.orderRepo.save(order);

    const orderItems = items.map(i =>
      this.itemRepo.create({
        order:   { order_id: savedOrder.order_id } as any,
        product: { product_id: i.product_id }      as any,
        quantity: i.quantity,
        price:    i.price,
      }),
    );
    await this.itemRepo.save(orderItems);

    await this.notificationsService.createOrderNotification(
      userId, savedOrder.order_id, 'confirmed');

    return this.findOne(savedOrder.order_id);
  }

  findByUser(userId: number) {
    return this.orderRepo.find({
      where:     { user: { user_id: userId } },
      relations: ['items', 'items.product', 'items.product.category'],
      order:     { created_at: 'DESC' },
    });
  }

  findAll() {
    return this.orderRepo.find({
      relations: ['user', 'items', 'items.product', 'items.product.category'],
      order:     { created_at: 'DESC' },
    });
  }

  async findOne(orderId: number) {
    const order = await this.orderRepo.findOne({
      where:     { order_id: orderId },
      relations: ['user', 'items', 'items.product', 'items.product.category'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(orderId: number, status: string) {
    const order = await this.orderRepo.findOne({
      where:     { order_id: orderId },
      relations: ['user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    await this.orderRepo.save(order);

    if (order.user?.user_id) {
      await this.notificationsService.createOrderNotification(
        order.user.user_id, orderId, status);
    }
    return order;
  }
}