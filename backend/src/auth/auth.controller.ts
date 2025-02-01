import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.username, body.password);
    const token = await this.authService.login(user);
    res.cookie('Authentication', token.token, {
      httpOnly: true,
      secure: true, // Set this to true in production with HTTPS
      maxAge: 3600000, // 1 hour
    });
    return { message: 'Login successful', token };
  }
}
