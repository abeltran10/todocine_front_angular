import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { MovieService } from '../../core/services/movie.service';
import { UsuarioMovieService } from '../../core/services/usuarioMovie.service';
import { MovieComponent } from './movie/movie.component';

import { MovieDetail } from '../../core/models/movieDetail.model';
import { UsuarioMovie } from '../../core/models/usuarioMovie.model';

import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    MovieComponent
  ],
  templateUrl: './movie-detail.component.html'
})
export class MovieDetailComponent implements OnInit {
  usuario!: User | null;
  
  movieDetail = signal<MovieDetail | null>(null);
  
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private usuarioMovieService: UsuarioMovieService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.currentUser;

    const movieId = Number(this.route.snapshot.paramMap.get('movieId'));
    this.loadMovieDetail(movieId); 
  }

   loadMovieDetail(movieId: number) {
       this.movieService.getDetailMovieById(movieId)
         .subscribe({
            next: (movie) => this.movieDetail.set(movie),
            error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error cargando la película')
         });         
    }

  addFavoritos(movie: MovieDetail) {
    this.updateFavs(movie, true);
  }


  removeFavoritos(movie: MovieDetail) {
    this.updateFavs(movie, false);
  }

  addVote(movie: MovieDetail, rating: number) {
      if (!this.usuario) return;

      const usuarioMovie: UsuarioMovie = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: movie.vista,
        favoritos: movie.favoritos,
        voto: rating
      };
      
      this.usuarioMovieService.updateUsuarioMovie(
                this.usuario.id,
                movie.id,
                usuarioMovie
              ).subscribe({
                next: (movie) => this.movieDetail.set(movie),
                error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error cargando la película')
              });
    }

  updateFavs(
    movie: MovieDetail,
    favoritos: boolean    
  ) {

    if (!this.usuario) return;

    const usuarioMovie: UsuarioMovie = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: false,
        favoritos,
        voto: null
    };

     
    this.usuarioMovieService.updateUsuarioMovie(
          this.usuario.id,
          movie.id,
          usuarioMovie
    ).subscribe({
                  next: (movie) => {
                    this.movieDetail.set(movie);
                    this.notificationService.showSuccess(favoritos ? "Añadida película a favoritos" : "Eliminada película de favoritos");
                  },
                  error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error gestionando favoritos')
                  

            });   
    
      
  }

  updateVista(movie: MovieDetail, isVista: boolean) {
       if (!this.usuario) return;

       const usuarioMovie: UsuarioMovie = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: isVista,
        favoritos: movie.favoritos,
        voto: null
      };
      
      this.usuarioMovieService.updateUsuarioMovie(
                this.usuario.id,
                movie.id,
                usuarioMovie
              ).subscribe({
                    next: (movie) => {
                      this.movieDetail.set(movie);
                      this.notificationService.showSuccess(isVista ? "Película vista" : "Película no vista");
                    },
                    error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error gestionando vista')  
              });
  }

}
