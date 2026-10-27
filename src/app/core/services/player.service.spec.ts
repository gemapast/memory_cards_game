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

  it('should register a trimmed player name', () => {
    service.register('  Ada  ');

    expect(service.player()).toEqual({ name: 'Ada' });
  });

  it('should ignore an empty or blank name', () => {
    service.register('   ');

    expect(service.player()).toBeNull();
  });

  it('should persist the player in localStorage', () => {
    service.register('Grace');

    const stored = localStorage.getItem('memory-cards:player');
    expect(stored).toBe(JSON.stringify({ name: 'Grace' }));
  });

  it('should restore the player from localStorage on init', () => {
    localStorage.setItem('memory-cards:player', JSON.stringify({ name: 'Linus' }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const restoredService = TestBed.inject(PlayerService);

    expect(restoredService.player()).toEqual({ name: 'Linus' });
  });

  it('should clear the player and the storage', () => {
    service.register('Ada');

    service.clear();

    expect(service.player()).toBeNull();
    expect(localStorage.getItem('memory-cards:player')).toBeNull();
  });
});
