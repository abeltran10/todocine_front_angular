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
import { Movie } from '../../core/models/movie.model';

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

  //Se hace así para evitar un parpadeo en la pantalla trás modificar la movie
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
  ) {}

  ngOnInit(): void {
    const loggedUser = localStorage.getItem('loggedUser');
    this.usuario = JSON.parse(loggedUser!);

    const movieId = Number(this.route.snapshot.paramMap.get('movieId'));
    this.loadMovieDetail(movieId);
  }

   loadMovieDetail(movieId: number) {
       this.movieService.getDetailMovieById(movieId)
         .subscribe({
            next: (movie) => this.movieDetailSubject.next(movie),
            error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error cargando la película')
         });         
    }

  addFavoritos(movie: MovieDetail) {
    this.updateFavs(movie, true);
  }


  removeFavoritos(movie: MovieDetail) {
    this.updateFavs(movie, false);
  }

  addVote(movie: MovieDetail, rating: number) {
    
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
                error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error cargando la película')
              });
    }

  updateFavs(
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

     
      this.usuarioMovieService.updateUsuarioMovie(
            this.usuario.id,
            movie.id,
            usuarioMovie
      ).subscribe({
                   next: (movie) => {
                      this.movieDetailSubject.next(movie);
                      this.setSuccessMessage(favoritos ? "Añadida película a favoritos" : "Eliminada película de favoritos");
                   },
                   error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error gestionando favoritos')
                   

              });   
      
      
  }

  updateVista(movie: MovieDetail, isVista: boolean) {
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
                      this.setSuccessMessage(isVista ? "Película vista" : "Película no vista");
                    },
                    error: (error) => this.setErrorMessage(error?.error?.message ?? 'Error gestionando vista')  
              });
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
