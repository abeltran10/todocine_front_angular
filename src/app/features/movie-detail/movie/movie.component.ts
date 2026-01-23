import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieDetail } from '../../../core/models/movieDetail.model';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.component.html',
})
export class MovieComponent {

  @Input() movieDetail!: MovieDetail;

  @Output() addFavoritos = new EventEmitter<MovieDetail>();
  @Output() removeFavoritos = new EventEmitter<MovieDetail>();
  @Output() addVote = new EventEmitter<{ movie: MovieDetail; rating: number }>();

  get showAddButton(): boolean {
    return this.movieDetail.favoritos;
  }

  get img(): string | null {
    return this.movieDetail.poster_path
      ? `https://image.tmdb.org/t/p/w500/${this.movieDetail.poster_path}`
      : null;
  }

  get video(): string | null {
    return this.movieDetail.videos?.length
      ? `https://www.youtube.com/embed/${this.movieDetail.videos[0].key}`
      : null;
  }

  get releaseDate(): string {
    return this.movieDetail.release_date
      ? `(${this.movieDetail.release_date.split('-')[0]})`
      : '';
  }

  handleFavoritos() {
    this.addFavoritos.emit(this.movieDetail);
  }

  handleRemoveFav() {
    this.removeFavoritos.emit(this.movieDetail);
  }

  handleVote(rate: number) {
    this.addVote.emit({ movie: this.movieDetail, rating: rate });
  }

  ratingStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  get genresText(): string {
  return this.movieDetail?.genres?.map(g => g.name).join(' | ') ?? '';
}
}
