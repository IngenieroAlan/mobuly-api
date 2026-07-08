import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  info(message: string, context?: Record<string, unknown>): void {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('WARN', message, context);
  }

  error(
    message: string,
    error?: unknown,
    context?: Record<string, unknown>,
  ): void {
    this.log('ERROR', message, {
      ...context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('DEBUG', message, context);
  }

  private log(
    level: string,
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;

    if (context && Object.keys(context).length > 0) {
      console.log(`${prefix} ${message}`, JSON.stringify(context));
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
}
