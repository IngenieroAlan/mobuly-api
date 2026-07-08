import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/index.js';
import { LoggerService } from '../logger/LoggerService.js';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, HttpStatus> = {
      VALIDATION_ERROR: HttpStatus.BAD_REQUEST,
      NOT_FOUND: HttpStatus.NOT_FOUND,
      UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
      APPOINTMENT_OVERLAP: HttpStatus.CONFLICT,
      INFRASTRUCTURE_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    const status =
      statusMap[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.warn(
      `Domain exception: ${exception.code} - ${exception.message}`,
    );

    response.status(status).json({
      error: {
        code: exception.code,
        message: exception.message,
      },
    });
  }
}
