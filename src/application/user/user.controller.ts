import { Body, Controller, Get, Logger, Param, Post, Put, Query, UseGuards, type BadRequestException } from "@nestjs/common";
import { UserService } from "./user.service";
import type { CreateUserDTO } from "./dto/create-user.dto";
import type { UpdateUserDTO } from "./dto/update-user.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Public } from "../auth/is-public.decorator";
import { Roles } from "../auth/roles.decorator";

@Controller('user')
@UseGuards(AuthGuard)  
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  @Public()  // Pula AuthGuard para criação pública
  @Post('/student')
  async createStudent(@Body() data: CreateUserDTO) {
    this.logger.log(`Criando student: ${data.email}`);
    return this.userService.createStudent(data);
  }

  @Public()  // Pula AuthGuard para criação pública
  @Post('/admin')
  async createAdmin(@Body() data: CreateUserDTO) {
    this.logger.log(`Criando admin: ${data.email}`);  
    return this.userService.createAdmin(data);
  }

  @Put('/student')
  async updateUser(@Body() data: UpdateUserDTO) {
    this.logger.log(`Atualizando student: ${data.id}`);
    return this.userService.updateUser(data.id, data);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    this.logger.log(`Buscando user: ${id}`);
    return this.userService.getUser(id);
  }

  @Get('/')
  @Roles('ADMIN')  // ← Maiúscula para bater com enum Prisma (ajuste se for 'admin')
  async getUsers(
    @Query('page', {transform: Number}) page: number = 1,  // Default 1
    @Query('perPage', { transform: Number}) perPage: number = 10  // Default 10, sem transform (faça no service)
  ) {
    this.logger.log(`Listando users: page ${page}, perPage ${perPage}`);
    return this.userService.getUsers(page, perPage);
  }
}