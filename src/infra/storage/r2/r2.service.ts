import { Injectable, BadRequestException } from '@nestjs/common';

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Annex } from '@/domain/value-objects/annex';
import type { UserId } from '@/domain/value-objects/id';

@Injectable()
export class R2UploadService {
  private s3Client: Bun.S3Client;

  constructor() {
    // Configuração nativa do Bun.S3Client para R2
    this.s3Client = new Bun.S3Client({
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: 'auto',  // Obrigatório para R2
      bucket: process.env.R2_BUCKET_NAME!,
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
    const objectKey = `certs/${ownerId.toString()}/${slug}/${uuidv4()}.${fileExt}`;

    
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Upload nativo com Bun.S3Client
    try {
      await this.s3Client.write(objectKey, fileBuffer, {
        type: contentType, 
      });
      console.log(`Upload OK para key: ${objectKey}`);

      // URL pública (se bucket público; senão, gere presigned abaixo)
      const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${objectKey}`;

      // Retorna Annex
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
  getPresignedUrl(objectKey: string, options: { expiresIn?: number; method?: 'GET' | 'PUT' | 'DELETE' } = { expiresIn: 3600 }): string {
    return this.s3Client.presign(objectKey, options);
  }

  // Opcional: Delete (para reject de certificate)
  async deleteObject(objectKey: string): Promise<void> {
    await this.s3Client.delete(objectKey);
  }
}