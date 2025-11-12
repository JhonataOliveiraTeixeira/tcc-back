import { Injectable,  ForbiddenException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import type { Request } from 'express';  // ← Import para estender
import type { UserPayload } from './types';  // Ajuste o path se necessário


interface AuthRequest extends Request {
  user: UserPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // Tipa o request como AuthRequest para acessar user sem erro
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;  // ← Agora tipado e sem erro

    if (!user || !user.role) {
      throw new ForbiddenException('Usuário sem role definida');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(`Acesso negado: role '${user.role}' não autorizada`);
    }

    return true;
  }
}