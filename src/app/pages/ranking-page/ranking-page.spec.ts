import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RankingPage } from './ranking-page';
import { PlayerService } from '../../core/services/player/player.service';

describe('RankingPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [RankingPage, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
  }

  it('shows an empty state when no games have been recorded', async () => {
    await setup();
    const fixture = TestBed.createComponent(RankingPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RANKING_EMPTY');
    expect(compiled.querySelectorAll('.ranking-page__item')).toHaveLength(0);
  });

  it('lists players sorted by best score, highlighting the current player', async () => {
    await setup();
    const playerService = TestBed.inject(PlayerService);
    playerService.register('Low');
    playerService.recordResult(10);
    playerService.clear();
    playerService.register('High');
    playerService.recordResult(50);

    const fixture = TestBed.createComponent(RankingPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.ranking-page__item');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('High');
    expect(items[1].textContent).toContain('Low');
    expect(items[0].classList.contains('ranking-page__item--current')).toBe(true);
  });

  it('navigates back to /game when there is an active player', async () => {
    await setup();
    TestBed.inject(PlayerService).register('Ada');
    const fixture = TestBed.createComponent(RankingPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    fixture.componentInstance.goBack();

    expect(navigateSpy).toHaveBeenCalledWith('/game');
  });

  it('navigates back to /home when there is no active player', async () => {
    await setup();
    const fixture = TestBed.createComponent(RankingPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    fixture.componentInstance.goBack();

    expect(navigateSpy).toHaveBeenCalledWith('/home');
  });
});
