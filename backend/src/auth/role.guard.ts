import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from './user.entity/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly requiredRole: UserRole) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assume user is already authenticated
    return user?.role === this.requiredRole;
  }
}
