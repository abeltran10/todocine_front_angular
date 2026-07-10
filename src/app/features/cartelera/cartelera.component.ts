import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
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

  title = '';
  region!: string;

  emptyPaginator: Paginator<Movie> = {
      results: [], page: 1, total_pages: 1, total_results: 0
  }

  moviesSubject = new BehaviorSubject<Paginator<Movie> | null>(null);
  movies$ = this.moviesSubject.asObservable();

  selectedCineUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private notificationService: NotificationService,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        this.region = String(params.get('region'));
        const regionData: Region = Regions.getRegion(this.region as RegionKey);

       this.title = `CARTELERA ${regionData.name.toUpperCase()}`;

        this.loadCartelera(regionData.code, 1);
    });  
    
  }

  loadCartelera(region: string, page: number) {
     this.movieService.getMoviesPlayingNowByRegion(region, page).subscribe({
        next: (paginator) => this.moviesSubject.next(paginator),
        error: (error) => {
              this.notificationService.showError(error?.error?.message ?? 'Error cargando cartelera');
              this.moviesSubject.next(this.emptyPaginator);
      
        }
      });
  }


  get cines() {
    return Cines.getCinesByRegion(this.region);
  }

  goToCine(): void {
    if (this.selectedCineUrl) {
      window.open(this.selectedCineUrl, '_blank');
      this.selectedCineUrl = ''
    } else {
      alert('Por favor, selecciona un cine primero');
    }
  }

}

