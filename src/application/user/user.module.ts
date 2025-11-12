import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserDB } from "@/infra/db/user.db";
import { UserService } from "./user.service";
import { DBModule } from "@/infra/db/db.module";

@Module({
  controllers: [UserController],
  providers: [ UserService],
  imports: [DBModule],
  exports: [UserService]
})
export class UserModule {}