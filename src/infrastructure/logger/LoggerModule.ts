import { Module, Global } from '@nestjs/common';
import { LoggerService } from './LoggerService.js';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
