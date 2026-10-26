import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePage {
  protected readonly playerService = inject(PlayerService);
}
