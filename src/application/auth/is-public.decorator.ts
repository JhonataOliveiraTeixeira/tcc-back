
import { SetMetadata } from '@nestjs/common';
import { jwtConstants } from './constantes';

export const IS_PUBLIC_KEY = jwtConstants.public;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
