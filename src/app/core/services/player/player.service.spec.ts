import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerService);
  });

  it('should start with no player', () => {
    expect(service.player()).toBeNull();
  });

  it('should register a trimmed player name as a new player', () => {
    service.register('  Ada  ');

    expect(service.player()).toMatchObject({
      name: 'Ada',
      bestScore: 0,
    });
    expect(service.player()?.id).toBeTruthy();
  });

  it('should ignore an empty or blank name', () => {
    service.register('   ');

    expect(service.player()).toBeNull();
  });

  it('should persist the roster in localStorage', () => {
    service.register('Grace');

    const stored = JSON.parse(localStorage.getItem('memory-cards:players')!);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ name: 'Grace', bestScore: 0 });
  });

  it('should restore the current player from localStorage on init', () => {
    service.register('Linus');
    const playerId = service.player()!.id;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const restoredService = TestBed.inject(PlayerService);

    expect(restoredService.player()).toMatchObject({ id: playerId, name: 'Linus' });
  });

  it('should log out the current player without deleting their history', () => {
    service.register('Ada');

    service.clear();

    expect(service.player()).toBeNull();
    expect(service.ranking()).toHaveLength(1);
    expect(service.ranking()[0].name).toBe('Ada');
  });

  it('should reuse an existing player (case-insensitive) instead of creating a duplicate', () => {
    service.register('Ada');
    const firstId = service.player()!.id;
    service.clear();

    service.register('  ADA  ');

    expect(service.ranking()).toHaveLength(1);
    expect(service.player()?.id).toBe(firstId);
  });

  it('should record the result of a finished game for the current player', () => {
    service.register('Ada');

    service.recordResult(30);
    service.recordResult(10);

    expect(service.player()).toMatchObject({ bestScore: 30 });
  });

  it('should ignore recordResult when no player is active', () => {
    service.recordResult(30);

    expect(service.ranking()).toHaveLength(0);
  });

  it('should sort the ranking by best score descending', () => {
    service.register('Low');
    service.recordResult(10);
    service.clear();
    service.register('High');
    service.recordResult(50);

    expect(service.ranking().map((p) => p.name)).toEqual(['High', 'Low']);
  });

  it('should only keep the 3 most recently active players in recentPlayers', () => {
    vi.useFakeTimers();
    for (const name of ['One', 'Two', 'Three', 'Four']) {
      service.register(name);
      service.clear();
      vi.advanceTimersByTime(1000);
    }
    vi.useRealTimers();

    expect(service.recentPlayers().map((p) => p.name)).toEqual(['Four', 'Three', 'Two']);
  });
});
