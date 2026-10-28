import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from '../../core/interfaces/game.interface';
import { GameCard } from '../game-card/game-card';

@Component({
  selector: 'app-game-board',
  imports: [GameCard],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoard {
  @Input() board: Cell[] = [];
  @Input() disabled = false;
  @Output() cellClick = new EventEmitter<number>();
}
