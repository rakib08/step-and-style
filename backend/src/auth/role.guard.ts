// a partial fix needed, for automated splitting do if need otherwise leav it as it is.
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from './user.entity/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly jwtService = new JwtService({
    "secret": "your_secret_key",

  })
  constructor(private readonly requiredRole: UserRole,) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers.authorization;// 

    const token = bearer.split(" ")[1];

    const user = this.jwtService.decode(token);

    // console.log('User in RoleGuard:', user); // Debugging user object

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role !== this.requiredRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
