import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { GameInfo } from '../../components/game-info/game-info';
import { DifficultySelector } from '../../components/difficulty-selector/difficulty-selector';
import { GameBoard } from '../../components/game-board/game-board';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-game-page',
  imports: [TranslatePipe, GameInfo, DifficultySelector, GameBoard, Button],
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePage {
  protected readonly gameService = inject(GameService);
}
