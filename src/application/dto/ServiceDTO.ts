import { z } from 'zod';

export const CreateServiceSchema = z.object({
  nombre: z.string().min(1, 'Name is required').max(200),
  descripcion: z.string().max(2000).optional().nullable(),
  precio: z.number().nonnegative('Price cannot be negative').multipleOf(0.01),
  duracionMinutos: z
    .number()
    .int('Duration must be an integer')
    .positive('Duration must be positive'),
});

export type CreateServiceDTO = z.infer<typeof CreateServiceSchema>;

export const UpdateServiceSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  descripcion: z.string().max(2000).optional().nullable(),
  precio: z
    .number()
    .nonnegative('Price cannot be negative')
    .multipleOf(0.01)
    .optional(),
  duracionMinutos: z
    .number()
    .int('Duration must be an integer')
    .positive('Duration must be positive')
    .optional(),
});

export type UpdateServiceDTO = z.infer<typeof UpdateServiceSchema>;
