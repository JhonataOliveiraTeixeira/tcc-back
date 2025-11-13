import { Module } from "@nestjs/common";
import { UserDB } from "./user.db";
import { PrismaModule } from "./prisma/prisma.module";
import { CertificateDb } from "./certificate.db";


@Module({
  providers: [UserDB, CertificateDb],
  exports: [UserDB, CertificateDb], 
  imports: [PrismaModule]
})
export class DBModule {}