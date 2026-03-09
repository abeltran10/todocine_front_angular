import { Genre } from './genre.model';
import { Video } from './video.model'; 
   
export interface Ganador {
   premioId: number;

   premio: string;

   categoriaId: number;

   categoria: string;

   anyo: number;

   movieId: number;

   original_title: string;

   title: string;

   poster_path: string;

   overview: string;

   release_date: string;

}   
   
   