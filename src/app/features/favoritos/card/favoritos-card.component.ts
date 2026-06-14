import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MovieDetail } from '../../../core/models/movieDetail.model';

@Component({
  selector: 'app-favoritos-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favoritos-card.component.html',
  styleUrl: '/favoritos-card.component.css'
 })
export class FavoritosCardComponent {

  @Input() movie!: MovieDetail;

  constructor(private router: Router) {}

  get img(): string {
    return `https://image.tmdb.org/t/p/w500/${this.movie.poster_path}`;
  }

  get releaseDate(): string {
    return this.movie.release_date
      ? `(${this.movie.release_date.split('-')[0]})`
      : '';
  }

  get isVista(): boolean {
    return this.movie.vista;
  }

  handleLoadMovieDetail(): void {
    this.router.navigate(['/app/moviedetail', this.movie.id]);
  }
}
