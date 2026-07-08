import { z } from 'zod';

export const CreateClientSchema = z.object({
  nombre: z.string().min(1, 'Name is required').max(100),
  apellido: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email').max(254).optional().nullable(),
  telefono: z.string().min(1).max(20).optional().nullable(),
  notasGenerales: z.string().max(2000).optional().nullable(),
});

export type CreateClientDTO = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  apellido: z.string().min(1).max(100).optional(),
  email: z.string().email('Invalid email').max(254).optional().nullable(),
  telefono: z.string().min(1).max(20).optional().nullable(),
  notasGenerales: z.string().max(2000).optional().nullable(),
});

export type UpdateClientDTO = z.infer<typeof UpdateClientSchema>;
