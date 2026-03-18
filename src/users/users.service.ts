// src/users/users.service.ts
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(data: Partial<User>) {
    if (typeof data.password !== 'string')
      throw new Error('Password must be a string');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({ ...data, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    return user;
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where:  { user_id: userId },
      select: ['user_id', 'full_name', 'email', 'phone', 'role', 'photo_url', 'created_at'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // GET /users — all users (admin dashboard)
  findAll() {
    return this.userRepository.find({
      select: ['user_id', 'full_name', 'email', 'role', 'created_at'],
    });
  }

  // PATCH /users/me — update profile
  async updateProfile(userId: number, data: {
    full_name?:    string;
    phone?:        string;
    email?:        string;
    photo_url?:    string;
    old_password?: string;
    new_password?: string;
  }) {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Handle password change
    if (data.new_password) {
      if (!data.old_password)
        throw new BadRequestException('Current password is required');
      const isMatch = await bcrypt.compare(data.old_password, user.password);
      if (!isMatch)
        throw new UnauthorizedException('Current password is incorrect');
      user.password = await bcrypt.hash(data.new_password, 10);
    }

    if (data.full_name !== undefined) user.full_name = data.full_name;
    if (data.phone     !== undefined) user.phone     = data.phone;
    if (data.email     !== undefined) user.email     = data.email;
    if (data.photo_url !== undefined) user.photo_url = data.photo_url;

    await this.userRepository.save(user);
    return this.getProfile(userId);
  }
}