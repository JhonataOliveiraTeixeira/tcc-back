import { Injectable, BadRequestException } from '@nestjs/common';

import crypto from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Annex } from '../../../domain/value-objects/annex';
import type { UserId } from '../../../domain/value-objects/id';

@Injectable()
export class R2UploadService {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    // Configuração usando AWS SDK para compatibilidade Node
    this.bucket = process.env.R2_BUCKET_NAME!;
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadAnnex(
    fileBuffer: Buffer,
    contentType: string,
    ownerId: UserId,
    title: string
  ): Promise<Annex> {
    // Validações (use suas do Annex)
    if (fileBuffer.length === 0) {
      throw new BadRequestException('Arquivo vazio');
    }
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(contentType)) {
      throw new BadRequestException('MIME não permitido');
    }
    if (fileBuffer.length > 10 * 1024 * 1024) {  // 10MB
      throw new BadRequestException('Tamanho acima do limite');
    }

    // Gera key única: certs/{ownerId}/{title-slug}/{uuid}.{ext}
    const fileExt = contentType.split('/')[1] || 'bin';
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const objectKey = `certs/${ownerId.toString()}/${slug}/${crypto.randomUUID()}.${fileExt}`;

    
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Upload usando AWS SDK
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: objectKey,
          Body: fileBuffer,
          ContentType: contentType,
        }),
      );

      const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${objectKey}`;

      return Annex.fromUploadSpec({
        objectKey,
        contentType,
        size: fileBuffer.length,
        storage: 'R2',
        checksumHex: checksum,
        publicUrl,
      });
    } catch (error: any) {
      console.error('Erro no upload R2:', error.message);
      throw new BadRequestException(`Falha no upload: ${error.message}`);
    }
  }

  // Opcional: Presigned URL para download (se não público)
  async getPresignedUrl(
    objectKey: string,
    options: { expiresIn?: number; method?: 'GET' | 'PUT' | 'DELETE' } = { expiresIn: 3600 },
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: objectKey });
    return getSignedUrl(this.s3Client, command, { expiresIn: options.expiresIn });
  }

  // Opcional: Delete (para reject de certificate)
  async deleteObject(objectKey: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: objectKey }),
    );
  }
}