import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { Paginator } from '../../core/models/paginator.model';
import { NotificationService } from '../../core/services/notification.service';

import { CarteleraCardComponent } from './card/cartelera-card.component';
import { PaginatorComponent } from '../../shared/common/paginator/paginator.component';

import { Regions, RegionKey, Region } from '../../core/enum/regions';
import { Cines } from '../../core/enum/cines';
import { HeaderComponent } from '../../shared/layout/header/header.component';


@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarteleraCardComponent,
    PaginatorComponent,
    HeaderComponent
  ],
  templateUrl: './cartelera.component.html'
})
export class CarteleraComponent implements OnInit {

  title = signal('');
  region = signal('');

  emptyPaginator: Paginator<Movie> = {
      results: [], page: 1, total_pages: 1, total_results: 0
  };

  // Signal para las películas de la cartelera
  movies = signal<Paginator<Movie> | null>(null);

  selectedCineUrl = signal('');

  // Computed signal para los cines basado en la región actual
  cines = computed(() => {
    const currentRegion = this.region();
    return currentRegion ? Cines.getCinesByRegion(currentRegion) : [];
  });

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const regionParam = String(params.get('region'));
        this.region.set(regionParam);
        
        const regionData: Region = Regions.getRegion(regionParam as RegionKey);
        this.title.set(`CARTELERA ${regionData.name.toUpperCase()}`);

        this.loadCartelera(regionData.code, 1);
    });  
  }

  loadCartelera(regionCode: string, page: number) {
      window.scrollTo(0, 0);

      this.movieService.getMoviesPlayingNowByRegion(regionCode, page).subscribe({
        next: (paginator) => this.movies.set(paginator),
        error: (error) => {
              this.notificationService.showError(error?.error?.message ?? 'Error cargando cartelera');
              this.movies.set(this.emptyPaginator);
        }
      });
  }

  goToCine(): void {
    const url = this.selectedCineUrl();
    if (url) {
      window.open(url, '_blank');
      this.selectedCineUrl.set('');
    } else {
      alert('Por favor, selecciona un cine primero');
    }
  }
}

