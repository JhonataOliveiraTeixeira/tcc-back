import { Injectable } from "@nestjs/common";
import  { PrismaService } from "./prisma/prisma.service";

@Injectable()
export class CertificateDb {
 
  constructor(private readonly prisma: PrismaService) { } 
  public async getCertificatesByUserId(userId: string) {
    return await this.prisma.certificate.findMany({
      where: {
        ownerId: userId
      },
      include: {
        annex: {
          select: {
            publicUrl: true,
            contentType: true
          } 
        },
        owner: {
          select: { name: true }
        }
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}