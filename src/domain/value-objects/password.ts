import { InternalServerErrorException } from "@nestjs/common";
import type { ValueObjectInterface } from "./value-object.interface";
import bcrypt from 'bcrypt';

export class Password implements ValueObjectInterface {
  protected password: string;

  constructor(public value: string) {
    this.password = value;
  }

  static async create(value: string | null): Promise<Password> {
    if (!value) {
      throw new Error('Senha obrigatória'); // Melhor que "" vazia – evite senhas inválidas
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(value, saltRounds);
    return new Password(hashedPassword);
  }

  async equals(other: string): Promise<boolean> {
    if (!other) return false;
    try {
      const isOk = await bcrypt.compare(other, this.password);
      return isOk;
    } catch (error: any) {
      throw new InternalServerErrorException("Erro ao verificar senha");
    }
  }

  toString(): string {
    return this.password;
  }
}