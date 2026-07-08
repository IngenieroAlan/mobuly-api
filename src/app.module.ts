import { Module } from '@nestjs/common';
import { BackendModule } from './infrastructure/BackendModule.js';

@Module({
  imports: [BackendModule],
})
export class AppModule {}
