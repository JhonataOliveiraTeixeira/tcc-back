import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { R2Module } from 'src/infra/storage/r2/r2.module';
import { DBModule } from 'src/infra/db/db.module';


@Module({
  imports: [PrismaModule, R2Module, DBModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule { }