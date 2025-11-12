import { Module } from "@nestjs/common";
import { R2UploadService } from "./r2.service";

@Module({
  providers: [R2UploadService],
  exports: [R2UploadService]
})
export class R2Module {}