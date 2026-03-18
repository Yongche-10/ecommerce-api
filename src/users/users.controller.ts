// src/users/users.controller.ts
import { Controller, Post, Get, Patch, Body, Request, UseGuards } from '@nestjs/common';
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

  // GET /users/me — logged in user's profile
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  // PATCH /users/me — update profile (name, phone, email, password, photo)
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() body: any) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  // GET /users — all users (admin dashboard customer count)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }
}