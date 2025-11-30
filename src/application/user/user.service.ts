import { UserDB } from "@/infra/db/user.db";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Student } from "@/domain/student";
import type { UpdateUserDTO } from "./dto/update-user.dto";
import { Admin } from "@/domain/admin";

@Injectable()
export class UserService{
  constructor(
    private userDb: UserDB,
  ){}

  async createStudent(data: CreateUserDTO){
    const student = (await Student.create(data.name, data.email, data.curse, data.password)).toJson()

    const res = await this.userDb.create(student.id.toString(), student.name, student.email.toString(), student.password.toString(), student.role, student.course)
    return {
      ok: res.ok,
      data: res.data,
      error: res.error
    }
  }

  async createAdmin(data: CreateUserDTO){
    const admin = (await Admin.create(data.name, data.email, data.password )).toJson()
    console.log('admin', admin)

    const res = await this.userDb.create(admin.id.toString(), admin.name, admin.email.toString(), admin.password.toString(), admin.role)
    return {
      ok: res.ok,
      data: res.data,
      error: res.error
    }
  }


  async updateUser(id: string, data: UpdateUserDTO){
    const res = await this.userDb.update(id, data.name, data.email, data.password)
    return {
      ok: res.ok,
      data: res.data,
      error: res.error
    }
  }

  
  async getUser(id: string){

    if(!id){
       throw new BadRequestException("Id vazio")
    }

    const res = await this.userDb.getUser(id)
    return {
      ok: res.ok,
      data: res.data,
      error: res.error
    }
  }

  async getUsers(page: number, perPage: number){
    const res = await this.userDb.getUsers(page, perPage)
    return {
      ok: res.ok,
      data: res.data,
      error: res.error
    }
  }

  async getUserByEmail(email: string){
    const res = await this.userDb.getUserByEmail(email)
    return {
      ok: res.ok,
      data: res.data,
      error: res.error
    }
  }

}