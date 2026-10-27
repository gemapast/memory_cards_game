import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  DIFFICULTIES,
  DIFFICULTY_CONFIG,
  DIFFICULTY_LABELS,
  Difficulty,
} from '../../core/interfaces/game.interface';

@Component({
  selector: 'app-difficulty-selector',
  imports: [TranslatePipe],
  templateUrl: './difficulty-selector.html',
  styleUrl: './difficulty-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifficultySelector {
  @Input() selected: Difficulty | null = null;
  @Input() disabled = false;
  @Input() canStart = false;
  @Output() selectDifficulty = new EventEmitter<Difficulty>();
  @Output() startGame = new EventEmitter<void>();

  readonly difficulties = DIFFICULTIES;
  readonly difficultyLabels = DIFFICULTY_LABELS;
  readonly difficultyConfig = DIFFICULTY_CONFIG;

  isSelected(level: Difficulty): boolean {
    return this.selected === level;
  }
}
