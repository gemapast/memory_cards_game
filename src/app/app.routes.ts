import { Routes } from '@angular/router';
import { playerGuard } from './core/guards/player.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'game',
    canActivate: [playerGuard],
    loadComponent: () => import('./pages/game-page/game-page').then((m) => m.GamePage),
  },
  {
    path: 'ranking',
    loadComponent: () => import('./pages/ranking-page/ranking-page').then((m) => m.RankingPage),
  },
  { path: '**', redirectTo: 'home' },
];
