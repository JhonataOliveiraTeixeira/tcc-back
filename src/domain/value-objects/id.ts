import { randomUUID } from "crypto";
import type { ValueObjectInterface } from "./value-object.interface";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export abstract class EntityId implements ValueObjectInterface<EntityId> {
  private readonly _value: string;

  protected constructor(value: string) {
    if (!value) throw new Error("Id vazio");
    if (!UUID_REGEX.test(value)) throw new Error("Id não é um UUID válido");
    this._value = value;
    Object.freeze(this);
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }

  equals(other: EntityId | null | undefined): boolean {
    return !!other && this._value === other._value && this.constructor === other.constructor;
  }

  // Fábricas para subclasses usarem
  protected static newUuid(): string {
    return randomUUID(); // v4
  }

  protected static assertUuid(value: string): void {
    if (!UUID_REGEX.test(value)) throw new Error("Id não é um UUID válido");
  }
}

// Fábricas
export class UserId extends EntityId {
  private constructor(value: string) { super(value); }
  static new(): UserId { return new UserId(EntityId.newUuid()); }
  static from(value: string): UserId { EntityId.assertUuid(value); return new UserId(value); }
}

export class CertificateId extends EntityId {
  private constructor(value: string) { super(value); }
  static new(): CertificateId { return new CertificateId(EntityId.newUuid()); }
  static from(value: string): CertificateId { EntityId.assertUuid(value); return new CertificateId(value); }
}
