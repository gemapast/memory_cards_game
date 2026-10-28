import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from '../../core/interfaces/game.interface';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCard {
  @Input({ required: true }) cell!: Cell;
  @Input() disabled = false;
  @Output() selectCell = new EventEmitter<number>();

  onClick(): void {
    if (this.isDisabled) {
      return;
    }
    this.selectCell.emit(this.cell.position);
  }

  get isHidden(): boolean {
    return this.cell.state === 'hidden';
  }

  get isVisible(): boolean {
    return this.cell.state === 'visible';
  }

  get isCorrect(): boolean {
    return this.cell.state === 'correct';
  }

  get isWrong(): boolean {
    return this.cell.state === 'wrong';
  }

  get isDisabled(): boolean {
    return this.disabled || !this.isHidden;
  }
}
