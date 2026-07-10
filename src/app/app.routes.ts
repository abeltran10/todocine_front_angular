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
import { GanadorAnyadirComponent } from './features/premios/ganador-form/ganador-anyadir.component';
import { AppLayoutComponent } from './shared/layout/app/app-layout.component';

import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { ListaDetailComponent } from './features/listas/lista-detail/lista-detail.component';
import { ListaComponent } from './features/listas/listado-listas/lista.component';

export const routes: Routes = [
  // Rutas públicas que NO usan el AppLayout
  { path: 'app', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'app/createaccount', component: CreateAccountComponent, canActivate: [publicGuard] },

  // Rutas protegidas que SÍ usan el AppLayout
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authGuard], // El guardia actúa sobre el grupo
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'premio/:premioId', component: PremioAnyosComponent },
      { path: 'premio/:premioCod/anyo/:premioAnyo', component: PremioComponent },
      { path: 'moviedetail/:movieId', component: MovieDetailComponent },
      { path: 'favoritos', component: FavoritosComponent },
      { path: 'cartelera/:region', component: CarteleraComponent },
      { 
        path: 'ganador', 
        component: GanadorAnyadirComponent, 
        data: { expectedRole: ['ADMIN'] } 
      },
      { path: 'listas', component: ListaComponent },
      { path: 'listas/:listaId', component: ListaDetailComponent },
    ]
  },

  { path: '**', redirectTo: 'app' }
];