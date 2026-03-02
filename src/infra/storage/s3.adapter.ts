import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { ObjectStorage, S3AdapterOptions } from "./storage";

@Injectable()
export class S3Adapter implements ObjectStorage{
  private client: S3Client;
  private bucket: string;

  constructor(options?: S3AdapterOptions) {
    this.bucket = options?.bucket || process.env.S3_BUCKET_NAME!;
    this.client = new S3Client({
      region: options?.region || process.env.AWS_REGION || 'us-east-1',
      endpoint: options?.endpoint,
      credentials: {
        accessKeyId: options?.accessKeyId || process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: options?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  static createClient(): S3Client {
    // helper if needed
    return new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  



  async presignPut(key: string, opts?: { expiresIn?: number; contentType?: string; acl?: S3AdapterOptions["defaultACL"]; }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: opts?.contentType,
      ACL: opts?.acl as any,
    });
    // presigning put, using 60s default if not provided
    return getSignedUrl(this.client, command, { expiresIn: opts?.expiresIn || 3600 });
  }

  async write(key: string, data: Buffer | Uint8Array | string): Promise<void> {
    let body: Buffer | Uint8Array | string = data;
    if (data instanceof ArrayBuffer) {
      body = new Uint8Array(data);
    }
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body }),
    );
  }

  async stat(key: string): Promise<{ size: number; etag: string; lastModified: Date; contentType?: string; }> {
    const head = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    return {
      size: Number(head.ContentLength || 0),
      etag: head.ETag || '',
      lastModified: head.LastModified || new Date(0),
      contentType: head.ContentType,
    };
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch (e: any) {
      if (e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw e;
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  publicUrl(key: string): string | undefined {
    if (process.env.S3_PUBLIC_URL) {
      return `${process.env.S3_PUBLIC_URL}/${key}`;
    }
    return undefined;
  }

}

