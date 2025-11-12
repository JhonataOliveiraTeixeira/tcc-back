import { Module } from "@nestjs/common";
import { Student } from "./student";

@Module({
  providers:[Student],
  exports:[Student]
})
export class DomainModule{}