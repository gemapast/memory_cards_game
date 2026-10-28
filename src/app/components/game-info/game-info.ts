import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DIFFICULTY_LABELS, Difficulty } from '../../core/interfaces/game.interface';

@Component({
  selector: 'app-game-info',
  imports: [TranslatePipe],
  templateUrl: './game-info.html',
  styleUrl: './game-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameInfo {
  @Input() difficulty: Difficulty | null = null;
  @Input() timeRemaining = 0;
  @Input() score = 0;

  readonly difficultyLabels = DIFFICULTY_LABELS;
}
