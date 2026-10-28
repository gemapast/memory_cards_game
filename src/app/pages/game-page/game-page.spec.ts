import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GamePage } from './game-page';
import { PlayerService } from '../../core/services/player/player.service';
import { GameService } from '../../core/services/game/game.service';

describe('GamePage', () => {
  let gameService: GameService;

  beforeEach(async () => {
    vi.useFakeTimers();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [GamePage, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
    gameService = TestBed.inject(GameService);
  });

  afterEach(() => {
    gameService.cancelTimers();
    vi.useRealTimers();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GamePage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should display the registered player's name and the difficulty options", () => {
    TestBed.inject(PlayerService).register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ana');
    expect(compiled.querySelectorAll('app-difficulty-selector button').length).toBe(4);
  });

  it('shows the score badge once a difficulty is selected and the game starts', () => {
    TestBed.inject(PlayerService).register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    gameService.setDifficulty('hard');
    gameService.start();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-game-info')).toBeTruthy();
    expect(compiled.textContent).toContain('0');
  });

  it('shows the board once a difficulty is selected and the game starts', () => {
    TestBed.inject(PlayerService).register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    gameService.setDifficulty('hard');
    gameService.start();
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('button.game-card');
    expect(cards.length).toBe(9);
  });

  it('allows selecting a cell and updates the score after a correct answer', () => {
    TestBed.inject(PlayerService).register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    gameService.setDifficulty('hard');
    gameService.start();
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();

    const target = gameService.targetValue();
    const cell = gameService.board().find((c) => c.value === target)!;
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      'button.game-card',
    );
    cards[cell.position].click();
    fixture.detectChanges();

    expect(gameService.score()).toBe(30);
  });

  it('clears the player and navigates home when exiting from the top bar', () => {
    const playerService = TestBed.inject(PlayerService);
    playerService.register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.top-bar__player')!.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('.top-bar__menu-button')!.click();
    fixture.detectChanges();

    expect(playerService.player()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith('/home');
  });

  it('keeps the score and hides the difficulty options when the game is over', () => {
    TestBed.inject(PlayerService).register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    gameService.setDifficulty('hard');
    gameService.start();
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();

    const board = gameService.board();
    const wrongCell = board.find((c) => c.value !== gameService.targetValue())!;
    gameService.selectCell(wrongCell.position);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(gameService.isGameOver()).toBe(true);
    expect(compiled.querySelector('app-game-info')).toBeTruthy();
    expect(compiled.querySelector('app-difficulty-selector')).toBeNull();
    expect(compiled.textContent).toContain('0');
  });

  it('resets the game and shows the difficulty options again when changing difficulty', () => {
    TestBed.inject(PlayerService).register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    gameService.setDifficulty('hard');
    gameService.start();
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();

    const board = gameService.board();
    const wrongCell = board.find((c) => c.value !== gameService.targetValue())!;
    gameService.selectCell(wrongCell.position);
    fixture.detectChanges();

    const actionButtons = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll<HTMLButtonElement>('.game-page__actions button');
    expect(actionButtons.length).toBe(2);
    actionButtons[1].click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(gameService.isGameOver()).toBe(false);
    expect(compiled.querySelector('app-difficulty-selector')).toBeTruthy();
    expect(compiled.querySelector('app-game-info')).toBeNull();
    expect(gameService.board().length).toBe(0);
    expect(gameService.difficulty()).toBeNull();
  });
});
