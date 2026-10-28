import { Cell } from '../interfaces/game.interface';

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createBoard(): Cell[] {
  const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  return values.map((value, position) => ({ position, value, state: 'visible' }));
}

export function pickRandomValue(): number {
  return Math.floor(Math.random() * 9) + 1;
}
