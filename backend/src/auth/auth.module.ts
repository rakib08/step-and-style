import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity/user.entity';
import { JwtStrategy } from './jwt.stratagy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your_jwt_secret', // Use env variables for production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
