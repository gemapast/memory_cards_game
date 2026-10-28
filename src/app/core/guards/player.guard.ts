import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlayerService } from '../services/player/player.service';

export const playerGuard: CanActivateFn = () => {
  const playerService = inject(PlayerService);
  const router = inject(Router);

  if (playerService.player()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
