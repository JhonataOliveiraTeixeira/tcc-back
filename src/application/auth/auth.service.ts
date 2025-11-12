
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import type { UserPayload } from './types';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) { }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const {data: user} = await this.usersService.getUserByEmail(email)
    console.log('user from authservice', user)
    const isValid = await user.login(email, pass)


    if(!isValid){
      throw new UnauthorizedException();
    }
    const payload: UserPayload = { id: user.toJson().id.toString(), name: user.toJson().name, role: user.toJson().role, email: user.toJson().email.toString() };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
