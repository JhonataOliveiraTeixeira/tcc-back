import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserDB } from "src/infra/db/user.db";
import { UserService } from "./user.service";
import { DBModule } from "src/infra/db/db.module";

@Module({
  controllers: [UserController],
  providers: [ UserService],
  imports: [DBModule],
  exports: [UserService]
})
export class UserModule {}