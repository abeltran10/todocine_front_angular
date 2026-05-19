import { MovieLista } from "./movieLista.model";

export interface Lista {
  id?: number | null;
  nombre: string;
  descripcion: string;
  movies?: MovieLista[];
  username: string;
  publica?: boolean;
}