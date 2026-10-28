import { Injectable, signal } from '@angular/core';
import { Player } from '../../interfaces/player.interface';

const STORAGE_KEY = 'memory-cards:player';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly playerSignal = signal<Player | null>(this.readFromStorage());
  readonly player = this.playerSignal.asReadonly();

  register(name: string): void {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    const player: Player = { name: trimmedName };
    this.playerSignal.set(player);
    this.writeToStorage(player);
  }

  clear(): void {
    this.playerSignal.set(null);
    this.writeToStorage(null);
  }

  private readFromStorage(): Player | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Player) : null;
    } catch {
      return null;
    }
  }

  private writeToStorage(player: Player | null): void {
    try {
      if (player) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      //
    }
  }
}
