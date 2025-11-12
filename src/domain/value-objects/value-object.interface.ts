export interface ValueObjectInterface<T = unknown> {
  equals(other: T): boolean | Promise<boolean>;
  toString(): string
}
