import { Injectable } from "@nestjs/common";
import  { PrismaService } from "./prisma/prisma.service";
import type { Status } from "@/domain/certificate";

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

  public async adminUpdateCertificateStatus(certificateId: string, status: Status) {
    const certificate = await this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: status

      }
    });
    if (!certificate) {
      return null;
    }
    return certificate
  }
}