import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { MovieService } from '../../core/services/movie.service';
import { UsuarioMovieService } from '../../core/services/usuarioMovie.service';
import { NavigationBarComponent } from '../../shared/layout/navigation-bar/navigation-bar.component';
import { NotificationComponent } from '../../shared/common/notification/notification.component'; 
import { MovieComponent } from './movie/movie.component';

import { MovieDetail } from '../../core/models/movieDetail.model';
import { User } from '../../core/models/user.model';
import { UsuarioMovie } from '../../core/models/usuarioMovie.model';
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBarComponent,
    NotificationComponent,
    MovieComponent
  ],
  templateUrl: './movie-detail.component.html'
})
export class MovieDetailComponent implements OnInit {

  usuario!: User;
  movieDetail!: MovieDetail;

  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private usuarioMovieService: UsuarioMovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    this.usuario = JSON.parse(loggedUser!);

    const movieId = String(this.route.snapshot.paramMap.get('movieId'));
    this.loadMovieDetail(movieId);
  }

  async loadMovieDetail(movieId: string) {
    try{
      const movie: MovieDetail = await this.movieService.getDetailMovieById(movieId);
      this.movieDetail = {...movie};
      this.cdr.detectChanges();
    } catch(error: any) {
        this.setErrorMessage(error?.error?.message ?? 'Error cargando la película');
    }
  }

  async addFavoritos(movie: MovieDetail) {
    this.updateUsuarioMovie(movie, true);
  }

  async removeFavoritos(movie: MovieDetail) {
    this.updateUsuarioMovie(movie, false);
  }

  async addVote(movie: MovieDetail, rating: number) {
    
      const payload = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: movie.vista,
        favoritos: movie.favoritos,
        voto: rating
      };
      try {
        const movieDet = await this.usuarioMovieService.updateUsuarioMovie(
                this.usuario.id,
                movie.id,
                payload
              );

      this.movieDetail = {...movieDet};
      this.cdr.detectChanges();
      } catch (error: any) {
          this.setErrorMessage(error?.error?.message ?? 'Error cargando la película');
      }
      
    }

  private async updateUsuarioMovie(
    movie: MovieDetail,
    favoritos: boolean    
  ) {
      const usuarioMovie: UsuarioMovie = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: false,
        favoritos,
        voto: null
      };

      try {
          const movieDet: MovieDetail = await this.usuarioMovieService.updateUsuarioMovie(
            this.usuario.id,
            movie.id,
            usuarioMovie
      );
          this.movieDetail = {...movieDet}
          this.cdr.detectChanges();

          this.setSuccessMessage("Añadida película a favoritos");
      } catch(error: any) {
          this.setErrorMessage(error?.error?.message ?? 'Error cargando la película');
      }     
    
  }

  private setSuccessMessage(msg: string) {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 5000);
  }

  private setErrorMessage(error: string) {
    this.errorMessage = error;
    setTimeout(() => (this.errorMessage = ''), 5000);
  }
}
