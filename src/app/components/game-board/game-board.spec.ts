import { TestBed } from '@angular/core/testing';
import { GameBoard } from './game-board';
import { Cell } from '../../core/interfaces/game.interface';

function buildBoard(): Cell[] {
  return Array.from({ length: 9 }, (_, position) => ({
    position,
    value: position + 1,
    state: 'hidden' as const,
  }));
}

describe('GameBoard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoard],
    }).compileComponents();
  });

  it('renders one card per cell', () => {
    const fixture = TestBed.createComponent(GameBoard);
    fixture.componentInstance.board = buildBoard();
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('button.game-card');
    expect(cards.length).toBe(9);
  });

  it('re-emits the position clicked on a card', () => {
    const fixture = TestBed.createComponent(GameBoard);
    fixture.componentInstance.board = buildBoard();
    fixture.detectChanges();

    const selected = vi.fn();
    fixture.componentInstance.cellClick.subscribe(selected);

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('button.game-card');
    (cards[2] as HTMLButtonElement).click();

    expect(selected).toHaveBeenCalledWith(2);
  });
});
