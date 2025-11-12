import { Body, Controller, Post } from "@nestjs/common";
import type { LoginStduentDTO } from "./dto/login-student.dto";
import  { AuthService } from "./auth.service";
import { Public } from "./is-public.decorator";

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}
  
  @Post('login')
  @Public()
  login(@Body() data: LoginStduentDTO) {
    return this.authService.signIn(data.email, data.password)
  }
}