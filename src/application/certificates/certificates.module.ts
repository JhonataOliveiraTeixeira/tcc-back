import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { PrismaModule } from '@/infra/db/prisma/prisma.module';
import { R2Module } from '@/infra/storage/r2/r2.module';


@Module({
  imports: [PrismaModule, R2Module],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule { }