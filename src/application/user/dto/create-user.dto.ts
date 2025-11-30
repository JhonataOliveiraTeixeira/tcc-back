import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDTO{
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  curse!: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 16)
  password!: string


  @IsString()
  role?: string




}