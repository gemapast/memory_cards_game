export type Difficulty = 'easy' | 'normal' | 'hard';
export type GameStatus = 'idle' | 'showing' | 'guessing' | 'roundComplete' | 'gameOver';

export interface DifficultyConfig {
  time: number;
  points: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { time: 10, points: 10 },
  normal: { time: 5, points: 20 },
  hard: { time: 2, points: 30 },
};

export const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard'];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'DIFFICULTY_EASY',
  normal: 'DIFFICULTY_NORMAL',
  hard: 'DIFFICULTY_HARD',
};

export const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  easy: 'sentiment_satisfied_alt',
  normal: 'sentiment_neutral',
  hard: 'sentiment_very_dissatisfied',
};

export type CellState = 'hidden' | 'visible' | 'correct' | 'wrong';

export interface Cell {
  position: number;
  value: number;
  state: CellState;
}
