// src/users/users.controller.ts
import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users/register
  @Post('register')
  register(@Body() data: any) {
    return this.usersService.register(data);
  }

  // GET /users/me  — returns full profile from DB
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }
}