import type { ValueObjectInterface } from "./value-object.interface";

export class Email implements ValueObjectInterface {
  protected email: string
  constructor( email: string) {
    this.isValidEmail(email);
    this.email = email
  }
  equals(other: unknown): boolean {
   
    if (other instanceof Email) {
      return this.email === other.email;
    }

    if (typeof other === 'string') {
      return this.email.toLowerCase().trim() === other.toLowerCase().trim();  
    }


    return false;
  }

  
  /**
   * Validate if the given email is valid.
   * @throws {Error} if the email is invalid.
   */
  private isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if( !emailRegex.test(email)){
      throw new Error("Email is invalid");
    }

  }

  toString(): string {
    return this.email
  }

}