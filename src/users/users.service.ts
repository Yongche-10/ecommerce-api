// src/users/users.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      select: ['user_id', 'full_name', 'email', 'phone', 'role', 'created_at'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}