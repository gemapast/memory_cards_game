import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { playerGuard } from './player.guard';
import { PlayerService } from '../services/player.service';

describe('playerGuard', () => {
  const fakeUrlTree = {} as UrlTree;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { createUrlTree: () => fakeUrlTree } }],
    });
  });

  function runGuard(): boolean | UrlTree {
    return TestBed.runInInjectionContext(() => playerGuard({} as never, {} as never)) as
      boolean | UrlTree;
  }

  it('should allow navigation when a player is registered', () => {
    TestBed.inject(PlayerService).register('Ada');

    expect(runGuard()).toBe(true);
  });

  it('should redirect to home when no player is registered', () => {
    expect(runGuard()).toBe(fakeUrlTree);
  });
});
