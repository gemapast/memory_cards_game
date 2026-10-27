import { Injectable, computed, signal } from '@angular/core';
import { Cell, DIFFICULTY_CONFIG, Difficulty, GameStatus } from '../interfaces/game.interface';
import { createBoard, pickRandomValue } from '../utils/game-board.util';

const ROUND_COMPLETE_DELAY_MS = 700;

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly statusSignal = signal<GameStatus>('idle');
  private readonly boardSignal = signal<Cell[]>([]);
  private readonly difficultySignal = signal<Difficulty | null>(null);
  private readonly scoreSignal = signal(0);
  private readonly targetValueSignal = signal<number | null>(null);
  private readonly timeRemainingSignal = signal(0);

  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private tickIntervalId: ReturnType<typeof setInterval> | null = null;

  readonly status = this.statusSignal.asReadonly();
  readonly board = this.boardSignal.asReadonly();
  readonly difficulty = this.difficultySignal.asReadonly();
  readonly score = this.scoreSignal.asReadonly();
  readonly targetValue = this.targetValueSignal.asReadonly();
  readonly timeRemaining = this.timeRemainingSignal.asReadonly();

  readonly isPlaying = computed(() => {
    const status = this.statusSignal();
    return status === 'showing' || status === 'guessing' || status === 'roundComplete';
  });
  readonly isGameOver = computed(() => this.statusSignal() === 'gameOver');
  readonly canStart = computed(() => this.difficultySignal() !== null && !this.isPlaying());

  setDifficulty(difficulty: Difficulty): void {
    if (this.isPlaying()) {
      return;
    }
    this.difficultySignal.set(difficulty);
  }

  start(): void {
    const difficulty = this.difficultySignal();
    if (!difficulty || this.isPlaying()) {
      return;
    }

    this.cancelTimers();
    this.scoreSignal.set(0);
    this.startRound(difficulty);
  }

  selectCell(position: number): void {
    if (this.statusSignal() !== 'guessing') {
      return;
    }

    const difficulty = this.difficultySignal();
    const board = this.boardSignal();
    const cell = board.find((c) => c.position === position);
    if (!difficulty || !cell || cell.state !== 'hidden') {
      return;
    }

    const isCorrect = cell.value === this.targetValueSignal();
    this.boardSignal.set(
      board.map((cell) =>
        cell.position === position ? { ...cell, state: isCorrect ? 'correct' : 'wrong' } : cell,
      ),
    );

    if (!isCorrect) {
      this.cancelTimers();
      this.statusSignal.set('gameOver');
      return;
    }

    this.scoreSignal.update((score) => score + DIFFICULTY_CONFIG[difficulty].points);
    this.statusSignal.set('roundComplete');
    this.hideTimeoutId = setTimeout(() => this.startRound(difficulty), ROUND_COMPLETE_DELAY_MS);
  }

  reset(): void {
    this.cancelTimers();
    this.statusSignal.set('idle');
    this.boardSignal.set([]);
    this.difficultySignal.set(null);
    this.targetValueSignal.set(null);
    this.scoreSignal.set(0);
    this.timeRemainingSignal.set(0);
  }

  cancelTimers(): void {
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    if (this.tickIntervalId !== null) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }

  private startRound(difficulty: Difficulty): void {
    this.boardSignal.set(createBoard());
    this.targetValueSignal.set(pickRandomValue());
    this.statusSignal.set('showing');

    const { time } = DIFFICULTY_CONFIG[difficulty];
    this.timeRemainingSignal.set(time);

    this.tickIntervalId = setInterval(() => {
      const remaining = this.timeRemainingSignal() - 1;
      this.timeRemainingSignal.set(remaining);
      if (remaining <= 0) {
        this.revealGuessPhase();
      }
    }, 1000);
  }

  private revealGuessPhase(): void {
    if (this.tickIntervalId !== null) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
    this.boardSignal.set(this.boardSignal().map((cell) => ({ ...cell, state: 'hidden' })));
    this.statusSignal.set('guessing');
  }
}
