import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { DIFFICULTY_CONFIG } from '../interfaces/game.interface';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  afterEach(() => {
    service.cancelTimers();
    vi.useRealTimers();
  });

  it('starts idle with no board and score 0', () => {
    expect(service.status()).toBe('idle');
    expect(service.board()).toEqual([]);
    expect(service.score()).toBe(0);
    expect(service.canStart()).toBe(false);
  });

  it('cannot start without a selected difficulty', () => {
    service.start();

    expect(service.status()).toBe('idle');
  });

  it('generates a 9-cell visible board with unique values 1-9 on start', () => {
    service.setDifficulty('hard');
    service.start();

    const board = service.board();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell.state === 'visible')).toBe(true);
    expect(new Set(board.map((cell) => cell.value))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    expect(service.status()).toBe('showing');
    expect(service.timeRemaining()).toBe(DIFFICULTY_CONFIG.hard.time);
  });

  it('hides the board and switches to guessing once the difficulty time elapses', () => {
    service.setDifficulty('hard');
    service.start();

    vi.advanceTimersByTime(DIFFICULTY_CONFIG.hard.time * 1000);

    expect(service.status()).toBe('guessing');
    expect(service.board().every((cell) => cell.state === 'hidden')).toBe(true);
  });

  it('ignores clicks while the board is still visible', () => {
    service.setDifficulty('easy');
    service.start();

    service.selectCell(0);

    expect(service.score()).toBe(0);
    expect(service.status()).toBe('showing');
  });

  it('ignores difficulty changes while a game is in progress', () => {
    service.setDifficulty('easy');
    service.start();

    service.setDifficulty('hard');

    expect(service.difficulty()).toBe('easy');
  });

  it('awards points and starts a new round on a correct guess', () => {
    service.setDifficulty('easy');
    service.start();
    vi.advanceTimersByTime(DIFFICULTY_CONFIG.easy.time * 1000);

    const target = service.targetValue();
    const correctCell = service.board().find((cell) => cell.value === target)!;
    service.selectCell(correctCell.position);

    expect(service.score()).toBe(DIFFICULTY_CONFIG.easy.points);
    expect(service.status()).toBe('roundComplete');

    vi.runOnlyPendingTimers();

    expect(service.status()).toBe('showing');
    expect(service.board().every((cell) => cell.state === 'visible')).toBe(true);
  });

  it('reveals the wrong cell and ends the game on an incorrect guess', () => {
    service.setDifficulty('easy');
    service.start();
    vi.advanceTimersByTime(DIFFICULTY_CONFIG.easy.time * 1000);

    const target = service.targetValue();
    const wrongCell = service.board().find((cell) => cell.value !== target)!;
    service.selectCell(wrongCell.position);

    expect(service.status()).toBe('gameOver');
    const revealed = service.board().find((cell) => cell.position === wrongCell.position)!;
    expect(revealed.state).toBe('wrong');
    expect(revealed.value).toBe(wrongCell.value);
  });

  it('resets the score to 0 when starting a new game after a game over', () => {
    service.setDifficulty('easy');
    service.start();
    vi.advanceTimersByTime(DIFFICULTY_CONFIG.easy.time * 1000);
    const target = service.targetValue();
    const wrongCell = service.board().find((cell) => cell.value !== target)!;
    service.selectCell(wrongCell.position);

    service.start();

    expect(service.score()).toBe(0);
    expect(service.status()).toBe('showing');
  });

  it('clears the selected difficulty on reset', () => {
    service.setDifficulty('easy');
    service.start();
    vi.advanceTimersByTime(DIFFICULTY_CONFIG.easy.time * 1000);
    const target = service.targetValue();
    const wrongCell = service.board().find((cell) => cell.value !== target)!;
    service.selectCell(wrongCell.position);

    service.reset();

    expect(service.difficulty()).toBeNull();
    expect(service.canStart()).toBe(false);
  });
});
