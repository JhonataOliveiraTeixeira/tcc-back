import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import type { userRole } from "generated/prisma/client"; // ← Type OK para tipos gerados
import { PrismaService } from "./prisma/prisma.service"; // ← SEM 'type'! Isso é o key
import  type { ResponseFunciton } from "@/application/utils/response-function";
import { Student } from "@/domain/student";
import { Password } from "@/domain/value-objects/password";
import  { Admin } from "@/domain/admin";

@Injectable()
export class UserDB {
  constructor(private readonly prisma: PrismaService) { } // ← Agora resolve como classe real

  async create(id: string, name: string, email: string, password: string, role: userRole): Promise<ResponseFunciton> {
    try {
      await this.prisma.user.create({
        data: {
          name,
          email,
          password,
          role,
          id
        }
      });
      return {
        ok: true,
        data: { id }, // ← Limpo, sem expor erros
        error: null
      };
    } catch (err: any) {
      // Opcional: Logger para debug
      console.error('Erro no UserDB.create:', err); // Ou use Nest Logger
      return {
        ok: false,
        data: err,
        error: new Error("Erro ao criar usuário")
      };
    }
  }

  async update(id: string, name?: string, email?: string, password?: string): Promise<ResponseFunciton> {
    try {
      await this.prisma.user.update({
        where: {
          id
        },
        data: {
          name,
          email,
          password,
        }
      });
      return {
        ok: true,
        data: { id }, // ← Limpo, sem expor erros
        error: null
      };
    } catch (err: any) {
      // Opcional: Logger para debug
      console.error('Erro no UserDB.update:', err); // Ou use Nest Logger
      return {
        ok: false,
        data: err,
        error: new Error("Erro ao atualizar usuário")
      };
    }
  }

  async getUser(id: string): Promise<ResponseFunciton> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
      if (!user) {
        throw new NotFoundException("User not found")
      }

      return {
        ok: true,
        data: user, // ← Limpo, sem expor erros
        error: null
      };
    } catch (err: any) {
      // Opcional: Logger para debug
      console.error('Erro no UserDB.getUser:', err); // Ou use Nest Logger
      throw new InternalServerErrorException("Erro ao buscar usuário");
    }
  }

  async getUsers(page: number, perPage: number): Promise<ResponseFunciton> {
    try {
      const users = await this.prisma.user.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
      return {
        ok: true,
        data: users, // ← Limpo, sem expor erros
        error: null
      };
    } catch (err: any) {
      // Opcional: Logger para debug
      console.error('Erro no UserDB.getUsers:', err); // Ou use Nest Logger
      return {
        ok: false,
        data: err,
        error: new Error("Erro ao buscar usuários")
      };
    }
  }

  async getUserByEmail(email: string): Promise<ResponseFunciton<Student | Admin>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true
        }
      });
      if (!user) {
        throw new NotFoundException("User not found")
      } else {
        
        return {
          ok: true,
          data: user.role === 'STUDENT' ? new Student(user.name, user.email, new Password(user.password), user.id) : new Admin(user.name, user.email, new Password(user.password), user.id), // ← Limpo, sem expor erros
          error: null
        };
      }
    } catch (err: any) {
      // Opcional: Logger para debug
      console.error('Erro no UserDB.getUserByEmail:', err); // Ou use Nest Logger
      throw new InternalServerErrorException("Erro ao buscar usuário");
    }
  }
}