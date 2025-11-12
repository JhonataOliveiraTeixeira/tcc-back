import { InternalServerErrorException } from "@nestjs/common";
import type { ValueObjectInterface } from "./value-object.interface";

export class Password implements ValueObjectInterface {
  protected password: string;

  constructor(public value: string) {
    this.password = value;
  }

  static async create(value: string | null): Promise<Password> {
    if (!value) {
      throw new Error('Senha obrigatória'); // Melhor que "" vazia – evite senhas inválidas
    }
    // Correção: Use objeto de opções para bcrypt
    const hashedPassword = await Bun.password.hash(value, {
      algorithm: 'bcrypt',
      cost: 12  // Work factor alto para segurança (10-14 ideal)
    });
    console.log('Hashed password:', hashedPassword);
    return new Password(hashedPassword);
  }

  async equals(other: string): Promise<boolean> {
    if (!other) return false;
    try {
      const isOk = await Bun.password.verify(other, this.password); // A instÂncia de Password contém o hash, portanto deve ser passado como seguudo argumento
      console.log('Password verification result:', isOk);
      return isOk
    } catch (error: any) {
      throw new InternalServerErrorException("Erro ao verificar senha");
    }
  }

  toString(): string {
    return this.password;
  }
}