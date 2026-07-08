export interface ServiceResponseDTO {
  id: string;
  userId: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracionMinutos: number;
  createdAt: Date;
  updatedAt: Date;
}
