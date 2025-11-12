import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';  // Ex: @Roles  
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);  