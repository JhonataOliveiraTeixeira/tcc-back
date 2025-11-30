import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/db/prisma/prisma.service';
import { R2UploadService } from '@/infra/storage/r2/r2.service';
import { Certificate } from '@/domain/certificate';
import { UserId } from '@/domain/value-objects/id';
import type { UserPayload } from '../auth/types';  // Ajuste path se necessário
import { CertificateDb } from '@/infra/db/certificate.db';
import type { ResponseFunciton } from '../utils/response-function';
import { CertificateMapper, type CertificatesWithAnnexAndOwner } from '../utils/certificates-mapper';

@Injectable()
export class CertificatesService {
  logger: Logger
  constructor(
    private prisma: PrismaService,
    private certRepository: CertificateDb,
    private r2Service: R2UploadService
  ) {

    this.logger = new Logger(CertificatesService.name);
  }

  async submitCertificate(
    title: string,
    hours: number,
    fileBuffer: Buffer,
    contentType: string,
    owner: string  // ID do owner (string)
  ) {
    // 1. Upload anexo para R2
    const annex = await this.r2Service.uploadAnnex(
      fileBuffer,
      contentType,
      UserId.from(owner),
      title
    );

    // 2. Cria Certificate VO (para validação)
    const certificate = Certificate.submit({
      ownerId: UserId.from(owner),
      hours,
      title,
      annex
    });

    // 3. Salva no Prisma com transação (atomicidade)
    const [savedAnnex, savedCertificate] = await this.prisma.$transaction(async (tx) => {
      // Cria annex primeiro
      const savedAnnex = await tx.annex.create({
        data: {
          id: annex.id.toString(),  // Assuma que Annex tem id; senão, gere UUID
          publicUrl: annex.publicUrl,
          contentType: annex.contentType,
          size: annex.size,
          storage: annex.storage,
          checksum: annex.checksum,
          objectKey: annex.objectKey,
        },
      });

      // Cria certificate com annexId do salvo
      const savedCertificate = await tx.certificate.create({
        data: {
          id: certificate.id.toString(),
          title: certificate.title(),
          hours: certificate.hours(),
          status: certificate.status(),
          submittedAt: certificate.submittedAt,
          ownerId: owner,  // String do param
          annexId: savedAnnex.id,  // FK agora válida
        },
      });

      return [savedAnnex, savedCertificate];
    });

    return {
      id: savedCertificate.id,
      title: savedCertificate.title,
      status: savedCertificate.status,
      annexUrl: savedAnnex.publicUrl,
      message: 'Certificado submetido com sucesso!',
    };
  }

  // Opcional: GET com filtro por role
  async getAll(user: UserPayload) {  // Tipado agora
    const where = user.role === 'STUDENT' ? { ownerId: user.id.toString() } : {};  
    return this.prisma.certificate.findMany({
      where,
      include: { 
        owner: {
           select: { name: true } 
          }
        },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async listCertificatesByUserId(user: UserPayload) {
    const certificates = await this.prisma.certificate.findMany({
      where: { ownerId: user.id.toString() },
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
    return certificates;
  }

  async getCertificate(id: string): Promise<ResponseFunciton<CertificatesWithAnnexAndOwner[]>> {
    this.logger.log(`Buscando certificado: ${id}`);
    const certificates = await this.certRepository.getCertificatesByUserId(id);
    return {
      ok: true,
      data: CertificateMapper.toArrayDomain(certificates),
      error: null
    };
  }

  async adminUpdateCertificate(id: string, data: any): Promise<ResponseFunciton<null | string>> {
    this.logger.log(`Atualizando certificado: ${id}`);
    const certificate = await this.certRepository.adminUpdateCertificateStatus(id, data);

    if (!certificate) {
      return {
        ok: false,
        data: null,
        error: new NotFoundException("Certificado nao encontrado")
      };
    }

    return {
      ok: true,
      data: "Update Suceesful",
      error: null
    };
  }
}