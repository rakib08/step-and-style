import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity/user.entity'; // Include UserRole enum

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, role: UserRole = UserRole.CUSTOMER) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ username, password: hashedPassword, role });
    return this.userRepository.save(newUser);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    // console.log('User Found:', user); // Debug user object
    if (user && (await bcrypt.compare(password, user.password))) {
      // console.log('Password Match:', true); // Debug password comparison
      return user;
    }
    // console.log('Password Match:', false); // Debug if password comparison fails
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role }; // Include role in the token payload
    return {
      token: this.jwtService.sign(payload), // Return token as a string
      //access_token: this.jwtService.sign(payload),
    };
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
