import { Movie } from "./movie.model";

export interface Lista {
  id?: number | null;
  nombre: string;
  descripcion: string;
  movies?: Movie[];
  username: string;
}