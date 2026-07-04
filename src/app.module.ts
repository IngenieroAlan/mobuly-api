import { Module } from "@nestjs/common";
import { BackendModule } from "./backend/infrastructure/BackendModule.js";

@Module({
  imports: [BackendModule],
})
export class AppModule {}
