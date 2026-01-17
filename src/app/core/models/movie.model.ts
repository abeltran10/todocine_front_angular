import { Genre } from './genre.model';
import { Video } from './video.model';

export interface Movie {
    id: string;
    original_title: string;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    popularity: number;
    vote_count: number;
    vote_average: number;
    genres: Genre[];
    original_language: string;
    videos: Video[];
    total_votos_TC: number;
    votos_media_TC: number;
}