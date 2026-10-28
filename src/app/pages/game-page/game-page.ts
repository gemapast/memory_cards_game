import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PlayerService } from '../../core/services/player/player.service';
import { GameService } from '../../core/services/game/game.service';
import { GameInfo } from '../../components/game-info/game-info';
import { DifficultySelector } from '../../components/difficulty-selector/difficulty-selector';
import { GameBoard } from '../../components/game-board/game-board';
import { TopBar } from '../../components/top-bar/top-bar';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-game-page',
  imports: [TranslatePipe, GameInfo, DifficultySelector, GameBoard, TopBar, Button],
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePage {
  protected readonly playerService = inject(PlayerService);
  protected readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  onExit(): void {
    this.gameService.reset();
    this.playerService.clear();
    this.router.navigateByUrl('/home');
  }
}
