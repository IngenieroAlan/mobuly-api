import { z } from 'zod';
import { AppointmentStatus } from '../../domain/enums/AppointmentStatus.js';

export const CreateAppointmentSchema = z.object({
  clienteId: z.string().uuid('Invalid client ID'),
  servicioId: z.string().uuid('Invalid service ID').optional().nullable(),
  fechaInicio: z.string().datetime('Invalid datetime format (ISO 8601)'),
  fechaFin: z
    .string()
    .datetime('Invalid datetime format (ISO 8601)')
    .optional()
    .nullable(),
  notasCita: z.string().max(2000).optional().nullable(),
});

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>;

export const UpdateAppointmentSchema = z.object({
  clienteId: z.string().uuid('Invalid client ID').optional(),
  servicioId: z.string().uuid('Invalid service ID').optional().nullable(),
  fechaInicio: z
    .string()
    .datetime('Invalid datetime format (ISO 8601)')
    .optional(),
  fechaFin: z
    .string()
    .datetime('Invalid datetime format (ISO 8601)')
    .optional()
    .nullable(),
  estado: z.nativeEnum(AppointmentStatus).optional(),
  notasCita: z.string().max(2000).optional().nullable(),
});

export type UpdateAppointmentDTO = z.infer<typeof UpdateAppointmentSchema>;
