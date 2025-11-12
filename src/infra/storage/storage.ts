export type S3AdapterOptions = {
  // passe explicitamente caso não queira depender das envs
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  region?: string;          // ex.: "us-east-1"
  endpoint?: string;        // ex.: "https://s3.us-east-1.amazonaws.com" | "https://<account-id>.r2.cloudflarestorage.com"
  bucket?: string;          // se usar endpoint “hosted-style” pode omitir
  virtualHostedStyle?: boolean; // true quando bucket está no host (ver exemplos)
  // ajuda a montar links de leitura pública (se você expõe via CDN/dominio)
  publicBaseUrl?: string;   // ex.: "https://cdn.meudominio.com/minhabucket"
  defaultACL?: "private" | "public-read" | "public-read-write" | "authenticated-read"
  | "aws-exec-read" | "bucket-owner-read" | "bucket-owner-full-control" | "log-delivery-write";
};


export interface ObjectStorage {
  presignPut(key: string, opts?: { expiresIn?: number; contentType?: string; acl?: S3AdapterOptions["defaultACL"] }): string;
  write(key: string, data: Blob | ArrayBuffer | string, contentType?: string): Promise<void>;
  stat(key: string): Promise<{ size: number; etag: string; lastModified: Date; contentType?: string }>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  publicUrl(key: string): string | undefined;
}