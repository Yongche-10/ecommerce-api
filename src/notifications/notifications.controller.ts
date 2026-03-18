// src/notifications/notifications.controller.ts
import { Controller, Get, Patch, Post, Param, Body, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications — user's notifications
  @Get()
  findAll(@Request() req) {
    return this.notificationsService.findByUser(req.user.userId);
  }

  // GET /notifications/unread-count
  @Get('unread-count')
  unreadCount(@Request() req) {
    return this.notificationsService.unreadCount(req.user.userId);
  }

  // PATCH /notifications/read-all
  @Patch('read-all')
  markAllRead(@Request() req) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  // PATCH /notifications/:id/read
  @Patch(':id/read')
  markRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markRead(+id, req.user.userId);
  }

  // POST /notifications/announce — admin only
  // Body: { title, body }
  @Post('announce')
  announce(@Body() body: { title: string; body: string }) {
    return this.notificationsService.announce(body.title, body.body);
  }
}