import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/user.entity/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    // Check if users already exist
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed');
      return;
    }

    // Seed users
    const hashedPassword1 = await bcrypt.hash('1234', 10);
    const hashedPassword2 = await bcrypt.hash('aiub123', 10);

    const users = [
      {
        username: 'manager01',
        password: hashedPassword1,
      },
      {
        username: 'manager02',
        password: hashedPassword2,
      },
    ];

    await this.userRepository.save(users);
    console.log('Seed data added successfully');
  }

  
  

}
