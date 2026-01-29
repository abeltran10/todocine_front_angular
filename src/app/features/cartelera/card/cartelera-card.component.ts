import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-cartelera-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartelera-card.component.html'
})
export class CarteleraCardComponent {

  @Input() movie: Movie | null = null;
  @Input() region: string | null = null;


  constructor(private router: Router) {}

  get img(): string {
    return `https://image.tmdb.org/t/p/w500/${this.movie?.poster_path}`;
  }

  get releaseDate(): string {
    return this.movie?.release_date
      ? `(${this.movie.release_date.split('-')[0]})`
      : '';
  }

  goToDetail() {
    this.router.navigate(['/app/moviedetail', this.movie?.id]);
  }

  get isRegionES() {
    return this.region === 'ES';
  }
    

}