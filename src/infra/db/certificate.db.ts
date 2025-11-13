import  { PrismaService } from "./prisma/prisma.service";

export class CertificateDb {
 
  constructor(private readonly prisma: PrismaService) { } 
  public getCertificatesByUserId(userId: string) {
    return this.prisma.certificate.findMany({
      where: {
        ownerId: userId
      }
    });
  }
}