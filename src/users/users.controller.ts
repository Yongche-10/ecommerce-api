// src/users/users.controller.ts
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me — logged in user's profile
  @Get('me')
  getMe(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  // GET /users — admin: list all users (for dashboard customer count)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}