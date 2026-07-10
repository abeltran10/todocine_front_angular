import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, BehaviorSubject, of, timer } from 'rxjs';

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

  title: string = ''; 

  usuario!: User | null;
  
  private movieDetailSubject = new BehaviorSubject<MovieDetail | null>(null);
  movieDetail$ = this.movieDetailSubject.asObservable();

  messageSuccessSubject = new BehaviorSubject<string>('');
  messageErrorSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();
  errorMessage$ = this.messageErrorSubject.asObservable();

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
            next: (movie) => this.movieDetailSubject.next(movie),
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
                next: (movie) => this.movieDetailSubject.next(movie),
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
                    this.movieDetailSubject.next(movie);
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
                      this.movieDetailSubject.next(movie);
                      this.notificationService.showSuccess(isVista ? "Película vista" : "Película no vista");
                    },
                    error: (error) => this.notificationService.showError(error?.error?.message ?? 'Error gestionando vista')  
              });
  }

}
