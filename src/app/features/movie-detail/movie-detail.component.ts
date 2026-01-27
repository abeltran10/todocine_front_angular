import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, BehaviorSubject, of, timer } from 'rxjs';

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
  movieDetail$!: Observable<MovieDetail | null>;

  messageSuccessSubject = new BehaviorSubject<string>('');
  messageErrorSubject = new BehaviorSubject<string>('');
  successMessage$ = this.messageSuccessSubject.asObservable();
  errorMessage$ = this.messageErrorSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private usuarioMovieService: UsuarioMovieService,
  ) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    this.usuario = JSON.parse(loggedUser!);

    const movieId = String(this.route.snapshot.paramMap.get('movieId'));
    this.loadMovieDetail(movieId);
  }

  loadMovieDetail(movieId: string) {
      this.movieDetail$ = this.movieService.getDetailMovieById(movieId)
          .pipe(
            catchError(error => {
              this.setErrorMessage(error?.error?.message ?? 'Error cargando la película');
              return of(null); 
            })
          );
      
  }

  addFavoritos(movie: MovieDetail) {
    this.updateUsuarioMovie(movie, true);
  }

  removeFavoritos(movie: MovieDetail) {
    this.updateUsuarioMovie(movie, false);
  }

  addVote(movie: MovieDetail, rating: number) {
    
      const payload = {
        usuarioId: this.usuario.id,
        movieId: movie.id,
        vista: movie.vista,
        favoritos: movie.favoritos,
        voto: rating
      };
      
      this.movieDetail$ = this.usuarioMovieService.updateUsuarioMovie(
                this.usuario.id,
                movie.id,
                payload
              ).pipe(
                catchError(error => {
                     this.setErrorMessage(error?.error?.message ?? 'Error cargando la película');
                     return of(null);
                })
              );      
    }

  updateUsuarioMovie(
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

     
      this.movieDetail$ = this.usuarioMovieService.updateUsuarioMovie(
            this.usuario.id,
            movie.id,
            usuarioMovie
      ).pipe(
        catchError(error => {
            this.setErrorMessage(error?.error?.message ?? 'Error cargando la película');
            return of(null)
        })
      ); 
      
      this.setSuccessMessage("Añadida película a favoritos")
  }

  setErrorMessage(message: string) {
      this.messageErrorSubject.next(message);
  
      // Usamos un timer de RxJS que es más compatible con Angular
      timer(5000).subscribe(() => this.messageErrorSubject.next(''));
  }
  
  setSuccessMessage(message: string) {
      this.messageSuccessSubject.next(message);
  
      // Usamos un timer de RxJS que es más compatible con Angular
      timer(5000).subscribe(() => this.messageSuccessSubject.next(''));
  }
}
