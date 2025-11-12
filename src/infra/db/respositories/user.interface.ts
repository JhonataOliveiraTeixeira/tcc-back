export interface IUser{
  create(name: string, email: string, password: string): Promise<void>
  login(email: string, password: string): Promise<boolean>
  logout(): Promise<boolean>
  uploadImage(userId : string, fileName: string, data: Blob | ArrayBuffer | string): Promise<boolean>
  deleteImage(userId : string): Promise<boolean>
}