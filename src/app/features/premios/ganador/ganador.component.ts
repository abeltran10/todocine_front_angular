import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Ganador } from '../../../core/models/ganador.model';

@Component({
  selector: 'app-ganador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ganador.component.html',
  styleUrl: '/ganador.component.css'
})
export class GanadorComponent {

  @Input({ required: true }) ganador!: Ganador;

  constructor(private router: Router) {}

  get imageUrl(): string {
    return `https://image.tmdb.org/t/p/w500/${this.ganador.poster_path}`;
  }

  get releaseYear(): string {
    return this.ganador.release_date
      ? `(${this.ganador.release_date.split('-')[0]})`
      : '';
  }

  goToMovieDetail(): void {
    this.router.navigate(['/app/moviedetail', this.ganador.movieId]);
  }
}
