import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  DIFFICULTIES,
  DIFFICULTY_CONFIG,
  DIFFICULTY_ICONS,
  DIFFICULTY_LABELS,
  Difficulty,
} from '../../core/interfaces/game.interface';
import { Button } from '../button/button';

@Component({
  selector: 'app-difficulty-selector',
  imports: [TranslatePipe, Button],
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
  readonly difficultyIcons = DIFFICULTY_ICONS;

  isSelected(level: Difficulty): boolean {
    return this.selected === level;
  }

  levelClass(level: Difficulty): string {
    return `difficulty-selector__button--${level}`;
  }
}
