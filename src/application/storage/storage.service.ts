import type { UserId } from "../../domain/value-objects/id";
import type { ObjectStorage } from "../../infra/storage/storage";

export class StorageService {
  constructor(
    private readonly StorageAdapter: ObjectStorage,
  ) { }

  async uploadImage(userId : UserId, fileName: string, data: Blob | ArrayBuffer | string): Promise<boolean> {

    const key = `certificates/${userId.toString()}/${fileName}`
    await this.StorageAdapter.write(key, data)

    
    return true
  }

}