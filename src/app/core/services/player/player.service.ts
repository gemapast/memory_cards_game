import { Injectable, computed, signal } from '@angular/core';
import { Player } from '../../interfaces/player.interface';

const PLAYERS_STORAGE_KEY = 'memory-cards:players';
const CURRENT_PLAYER_STORAGE_KEY = 'memory-cards:current-player-id';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly playersSignal = signal<Player[]>(this.readPlayers());
  private readonly currentPlayerIdSignal = signal<string | null>(this.readCurrentPlayerId());

  readonly ranking = computed(() =>
    [...this.playersSignal()].sort((a, b) => b.bestScore - a.bestScore),
  );

  readonly recentPlayers = computed(() =>
    [...this.playersSignal()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3),
  );

  readonly player = computed(
    () => this.playersSignal().find((p) => p.id === this.currentPlayerIdSignal()) ?? null,
  );

  register(name: string): void {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    const existing = this.playersSignal().find(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existing) {
      this.setCurrentPlayer(existing.id);
      return;
    }

    const player: Player = {
      id: crypto.randomUUID(),
      name: trimmedName,
      bestScore: 0,
      updatedAt: new Date().toISOString(),
    };

    this.playersSignal.update((players) => [...players, player]);
    this.writePlayers(this.playersSignal());
    this.setCurrentPlayer(player.id);
  }

  recordResult(score: number): void {
    const currentId = this.currentPlayerIdSignal();
    if (!currentId) {
      return;
    }

    this.playersSignal.update((players) =>
      players.map((p) =>
        p.id === currentId
          ? {
              ...p,
              bestScore: Math.max(p.bestScore, score),
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
    this.writePlayers(this.playersSignal());
  }

  clear(): void {
    this.setCurrentPlayer(null);
  }

  private setCurrentPlayer(id: string | null): void {
    this.currentPlayerIdSignal.set(id);
    try {
      if (id) {
        localStorage.setItem(CURRENT_PLAYER_STORAGE_KEY, id);
      } else {
        localStorage.removeItem(CURRENT_PLAYER_STORAGE_KEY);
      }
    } catch {
      //
    }
  }

  private readPlayers(): Player[] {
    try {
      const raw = localStorage.getItem(PLAYERS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Player[]) : [];
    } catch {
      return [];
    }
  }

  private readCurrentPlayerId(): string | null {
    try {
      return localStorage.getItem(CURRENT_PLAYER_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private writePlayers(players: Player[]): void {
    try {
      localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
    } catch {
      //
    }
  }
}
