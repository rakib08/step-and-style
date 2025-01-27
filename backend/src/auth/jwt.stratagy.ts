import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from header
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret', // Replace with your actual secret
    });
  }

  async validate(payload: any): Promise<User> {
    const { sub } = payload; // Extract user ID from the token
    const user = await this.userRepository.findOne({ where: { id: sub } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user; // This will be set in the request.user object
  }
}
