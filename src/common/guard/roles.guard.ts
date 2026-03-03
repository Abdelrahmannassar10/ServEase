import { Role } from "@common/types/enum";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { log } from "console";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    log('RolesGuard activated');
    const roles = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    log('Required roles:', roles);
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();
      log('User role:', user);
    return roles.includes(user.role);
  }
}