import { Injectable } from "@nestjs/common"
import { Email } from "./value-objects/email"
import { UserId } from "./value-objects/id"
import { Password } from "./value-objects/password"
import { userRole } from "generated/prisma/enums"

@Injectable()
export class Admin {
  private id: UserId
  private name: string
  private email: Email
  protected password: Password
  private role: userRole

  constructor(name: string, email: string, password: Password, id?: string, role: string = "ADMIN") {
    this.id = id ? UserId.from(id) : UserId.new()
    this.name = name
    this.email = new Email(email)
    this.password = password
    this.role = userRole.ADMIN
  }

  static async create(name: string, email: string, password: string | null, id?: string,): Promise<Admin> {

    const passwordVO = await Password.create(password)

    return new Admin(name, email, passwordVO, id)
  }
  toJson() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    if (await this.password.equals(password) && this.email.equals(email)) {
      return true
    }
    return false
  }

  getPassword(): Password {
    return this.password
  }

}