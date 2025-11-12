import { Module } from "@nestjs/common";
import { UserDB } from "./user.db";
import { PrismaModule } from "./prisma/prisma.module";


@Module({
  providers: [ UserDB ],
  exports: [UserDB], 
  imports: [PrismaModule]
})
export class DBModule {}