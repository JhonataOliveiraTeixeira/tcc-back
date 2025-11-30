import { Injectable } from "@nestjs/common"
import { Email } from "./value-objects/email"
import { UserId } from "./value-objects/id"
import  { Password } from "./value-objects/password"
import { userRole } from "generated/prisma/enums"

@Injectable()
export class Student{
  private id: UserId
  private course: string
  private name: string
  private email: Email
  protected password: Password 
  private role: userRole

  constructor(name: string, email: string, course: string, password: Password, id?: string, role: string = "stdudent") {
    this.id = id ? UserId.from(id) : UserId.new()
    this.name = name
    this.email = new Email(email)
    this.course = course
    this.password = password
    this.role = userRole.STUDENT
  }

  static async create(name: string, email: string, course: string, password: string | null, id?: string,): Promise<Student> {  

    const passwordVO = await Password.create(password)
    
    return new Student(name, email, course, passwordVO, id)
  }
  toJson(){
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      course: this.course,
      password: this.password,
      role: this.role
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    if(await this.password.equals(password) && this.email.equals(email)){
      return true
    }
    return false
  }

  async logout(): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  async uploadImage(image: string): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  async deleteImage(): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  getPassword(): Password{
    return this.password
  }

}