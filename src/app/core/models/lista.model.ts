import { Movie } from "./movie.model";

export interface Lista {
  id?: number;
  nombre: string;
  descripcion: string;
  movies?: Movie[];
  username: string;
}