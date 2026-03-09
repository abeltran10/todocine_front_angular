import { Genre } from './genre.model';
import { Video } from './video.model';

export interface Movie {
    id: number;
    original_title: string;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    
}