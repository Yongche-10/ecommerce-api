// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // GET /notifications — user's own notifications
  findByUser(userId: number) {
    return this.notifRepo.find({
      where:  { user: { user_id: userId } },
      order:  { created_at: 'DESC' },
    });
  }

  // GET /notifications/unread-count
  async unreadCount(userId: number) {
    const count = await this.notifRepo.count({
      where: { user: { user_id: userId }, is_read: false },
    });
    return { count };
  }

  // PATCH /notifications/:id/read — mark one as read
  async markRead(notifId: number, userId: number) {
    await this.notifRepo.update(
      { notification_id: notifId, user: { user_id: userId } },
      { is_read: true },
    );
    return { success: true };
  }

  // PATCH /notifications/read-all — mark all as read
  async markAllRead(userId: number) {
    await this.notifRepo
      .createQueryBuilder()
      .update()
      .set({ is_read: true })
      .where('user_id = :userId AND is_read = false', { userId })
      .execute();
    return { success: true };
  }

  // POST /notifications/announce — admin sends to all customers + stores for admin too
  async announce(title: string, body: string) {
    const everyone = await this.userRepo.find();
    const notifs = everyone.map(user =>
      this.notifRepo.create({
        user,
        title,
        body,
        type: 'announcement',
        is_read: false,
      }),
    );
    await this.notifRepo.save(notifs);
    const customers = everyone.filter(u => u.role === 'customer');
    return { sent: customers.length };
  }

  // Called internally when order status changes
  async createOrderNotification(userId: number, orderId: number, status: string) {
    const messages: Record<string, { title: string; body: string }> = {
      placed: {
        title: 'Order Placed 🛍️',
        body:  `Your order #${orderId} has been placed successfully. Waiting for confirmation.`,
      },
      confirmed:  {
        title: 'Order Confirmed ✅',
        body:  `Your order #${orderId} has been confirmed and is being processed.`,
      },
      shipped: {
        title: 'Order Shipped 🚚',
        body:  `Your order #${orderId} has been shipped. It's on its way!`,
      },
      delivered: {
        title: 'Order Delivered 🎉',
        body:  `Your order #${orderId} has been delivered. Enjoy your purchase!`,
      },
      cancelled: {
        title: 'Order Cancelled',
        body:  `Your order #${orderId} has been cancelled.`,
      },
    };

    const msg = messages[status];
    if (!msg) return;

    const notif = this.notifRepo.create({
      user:    { user_id: userId } as any,
      title:   msg.title,
      body:    msg.body,
      type:    'order',
      is_read: false,
    });
    return this.notifRepo.save(notif);
  }
}