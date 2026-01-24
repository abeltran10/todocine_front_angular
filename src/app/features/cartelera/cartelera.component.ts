import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';

import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { User } from '../../core/models/user.model';

import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { MovieCardComponent } from '../movie-detail/card/movie-card.component';
import { PaginatorComponent } from '../../shared/layout/paginator/paginator.component';

import { Regions, RegionKey, Region } from '../../core/enum/regions';
import { Award } from '../../core/enum/awards';

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

  movies$!: Observable<Paginator<Movie>>;

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
        const region = params.get('region');
        const regionData: Region = Regions.getRegion(region as RegionKey);

        this.title = `CARTELERA ${regionData.name.toUpperCase()}`;

        this.loadCartelera(regionData.code, 1);
    });

    
    
  }

  loadCartelera(region: string, page: number) {
    this.movies$ = this.movieService.getMoviesPlayingNowByRegion(region, page).pipe(
      catchError(error => {
        this.errorMessage = error?.error?.message ?? 'Error cargando cartelera';
        setTimeout(() => (this.errorMessage = ''), 5000);
        return of({
          results: [],
          page: 1,
          total_pages: 1,
          total_results: 0
        }); // emitimos un valor neutro para no romper el stream
      })
  );
}

  buildRows(movies: Paginator<Movie>): (Movie | null)[][] {
    if (!movies) return [];

    const rows: (Movie | null)[][] = [];
    const results = movies.results;
    console.log(results);

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
