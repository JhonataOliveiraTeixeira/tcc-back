import crypto from 'crypto';  // Para checksum
import { CertificateId } from './id';

type AllowedMime = "application/pdf" | "image/png" | "image/jpeg";
type StorageType = "S3" | "R2";

export class Annex {
  private constructor(
    public readonly id: CertificateId,
    public readonly objectKey: string,  // Simplificado: string validada no from()
    public readonly contentType: AllowedMime,
    public readonly size: number,  // Em bytes
    public readonly storage: StorageType,
    public readonly checksum?: string,  // SHA256 hex
    public readonly publicUrl?: string
  ) { }

  static fromUploadSpec(params: {
    objectKey: string;
    contentType: string;
    size: number;
    storage: StorageType;
    checksumHex?: string;
    publicUrl?: string;
  }): Annex {
    // Validações inline (menos VOs, mas mantém segurança)
    if (!/^[a-z0-9-/_\.]+$/i.test(params.objectKey)) {
      throw new Error("ObjectKey inválida");
    }
    const allowedMimes: AllowedMime[] = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedMimes.includes(params.contentType as AllowedMime)) {
      throw new Error("MIME não permitido");
    }
    const maxSize = 10 * 1024 * 1024;  // 10MB
    if (params.size > maxSize) {
      throw new Error("Tamanho acima do limite");
    }
    if (params.checksumHex && !/^[a-f0-9]{64}$/i.test(params.checksumHex)) {  // SHA256
      throw new Error("Checksum inválido");
    }

    return new Annex(
      CertificateId.new(),
      params.objectKey,
      params.contentType as AllowedMime,
      params.size,
      params.storage,
      params.checksumHex,
      params.publicUrl
    );
  }

  // Novo: Gera checksum se não tiver (útil pré-upload)
  static generateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}