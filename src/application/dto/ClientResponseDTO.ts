export interface ClientResponseDTO {
  id: string;
  userId: string;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  notasGenerales: string | null;
  createdAt: Date;
  updatedAt: Date;
}
