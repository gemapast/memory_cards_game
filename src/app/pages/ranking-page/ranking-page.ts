import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player/player.service';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-ranking-page',
  imports: [TranslatePipe, Button],
  templateUrl: './ranking-page.html',
  styleUrl: './ranking-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingPage {
  protected readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigateByUrl(this.playerService.player() ? '/game' : '/home');
  }
}
