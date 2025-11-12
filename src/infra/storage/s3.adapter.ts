import { s3, S3Client,  } from "bun";
import type { ObjectStorage, S3AdapterOptions } from "./storage";
import { Injectable } from "@nestjs/common";


@Injectable()
export class S3Adapter implements ObjectStorage{
  private client: S3Client

  constructor(options?: S3AdapterOptions) { 
    this.client = S3Adapter.createClient()
  }


  static createClient(): S3Client {
    return new S3Client({
      accessKeyId: "your-access-key",
      secretAccessKey: "your-secret-key",
      bucket: "my-bucket",
      // sessionToken: "..."
      // acl: "public-read",
      // endpoint: "https://s3.us-east-1.amazonaws.com",
      // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
      // endpoint: "https://<region>.digitaloceanspaces.com", // DigitalOcean Spaces
      // endpoint: "http://localhost:9000", // MinIO
    });
  }
  



  presignPut(key: string, opts?: { expiresIn?: number; contentType?: string; acl?: S3AdapterOptions["defaultACL"]; }): string {
    throw new Error("Method not implemented.");
  }
  async write(key: string, data: Blob | ArrayBuffer | string): Promise<void> {
    const res = await s3.write(key, data)

    if (res == 0) {
      throw new Error("Error in uploading file")
    }
    
  }
  stat(key: string): Promise<{ size: number; etag: string; lastModified: Date; contentType?: string; }> {
    throw new Error("Method not implemented.");
  }
  exists(key: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  publicUrl(key: string): string | undefined {
    throw new Error("Method not implemented.");
  }

}

