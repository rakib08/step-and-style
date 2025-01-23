import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../auth/user.entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seeding.');
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        username: 'manager',
        password: hashedPassword,
        role: UserRole.MANAGER, // Assign Manager role
      },
      {
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN, // Assign Admin role
      },
    ];

    await this.userRepository.save(users);
    console.log('Seed data added successfully.');
  }
}
