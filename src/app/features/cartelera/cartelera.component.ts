import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { MovieCardComponent } from '../movie-detail/card/movie-card.component';
import { PaginatorComponent } from '../../shared/layout/paginator/paginator.component';

import { Regions, RegionKey } from '../../core/enum/regions';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    HeaderComponent,
    MovieCardComponent,
    PaginatorComponent
  ],
  templateUrl: './cartelera.component.html'
})
export class CarteleraComponent implements OnInit {

  title = '';
  region!: string;

  usuario!: User;

  movies: Paginator<Movie> | null = null;

  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    // usuario logueado
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      this.usuario = JSON.parse(loggedUser);
    }

   

    this.route.paramMap.subscribe(params => {
        const region = params.get('region') as RegionKey;
        const regionData = Regions.getRegion(region);

        this.title = `CARTELERA ${regionData.name.toUpperCase()}`;

        this.loadCartelera(regionData.code, 1);
    });

    
    
  }

  async loadCartelera(region: string, page: number) {
    try {
      this.movies = await this.movieService.getMoviesPlayingNowByRegion(region, page);
    } catch (error: any) {
      this.errorMessage = error?.error?.message ?? 'Error cargando cartelera';
      setTimeout(() => (this.errorMessage = ''), 5000);
    }
  }

  /**
   * Devuelve filas de 3 películas (rellenando con null)
   */
  get movieRows(): (Movie | null)[][] {
    if (!this.movies) return [];

    const rows: (Movie | null)[][] = [];
    const results = this.movies.results;

    for (let i = 0; i < results.length; i += 3) {
      const row: (Movie | null)[] = results.slice(i, i + 3);

      while (row.length < 3) {
        row.push(null);
      }

      rows.push(row);
    }

    return rows;
  }
}
