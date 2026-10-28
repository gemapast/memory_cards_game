import { createBoard, pickRandomValue, shuffle } from './game-board.util';

describe('game-board.util', () => {
  describe('shuffle', () => {
    it('returns a permutation of the same items without mutating the input', () => {
      const original = [1, 2, 3, 4, 5];
      const result = shuffle(original);

      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(result).toHaveLength(original.length);
      expect([...result].sort()).toEqual([...original].sort());
    });
  });

  describe('createBoard', () => {
    it('creates 9 visible cells with unique values from 1 to 9', () => {
      const board = createBoard();

      expect(board).toHaveLength(9);
      expect(board.every((cell) => cell.state === 'visible')).toBe(true);
      expect(new Set(board.map((cell) => cell.position)).size).toBe(9);
      expect(new Set(board.map((cell) => cell.value))).toEqual(
        new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      );
    });
  });

  describe('pickRandomValue', () => {
    it('always returns an integer between 1 and 9', () => {
      for (let i = 0; i < 50; i++) {
        const value = pickRandomValue();
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(9);
      }
    });
  });
});
