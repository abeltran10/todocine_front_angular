import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { PremioAnyosComponent } from './features/premios/anyos/premio-anyos.component';
import { PremioComponent } from './features/premios/premio/premio.component';
import { MovieDetailComponent } from './features/movie-detail/movie-detail.component';
import { FavoritosComponent } from './features/favoritos/favoritos.component';
import { CreateAccountComponent } from './features/create-account/create-account.component';
import { CarteleraComponent } from './features/cartelera/cartelera.component';

import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  { path: 'app', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'app/home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'app/profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'app/premio/:premioId', component: PremioAnyosComponent, canActivate: [authGuard] },
  { path: 'app/premio/:premioCod/anyo/:premioAnyo', component: PremioComponent, canActivate: [authGuard] },
  { path: 'app/moviedetail/:movieId', component: MovieDetailComponent, canActivate: [authGuard] },
  { path: 'app/favoritos', component: FavoritosComponent, canActivate: [authGuard] },
  { path: 'app/createaccount', component: CreateAccountComponent, canActivate: [publicGuard] },
  { path: 'app/cartelera/:region', component: CarteleraComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'app' }
];
