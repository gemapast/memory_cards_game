import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TopBar } from './top-bar';

describe('TopBar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBar, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('displays the game title and the player name', () => {
    const fixture = TestBed.createComponent(TopBar);
    fixture.componentInstance.playerName = 'Ana';
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('GAME_TITLE');
    expect(text).toContain('Ana');
  });

  it('toggles the menu and emits exit when the option is clicked', () => {
    const fixture = TestBed.createComponent(TopBar);
    fixture.detectChanges();
    const exitSpy = vi.fn();
    fixture.componentInstance.exit.subscribe(exitSpy);

    const toggleButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;
    toggleButton.click();
    fixture.detectChanges();

    const exitButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button.top-bar__menu-button',
    ) as HTMLButtonElement;
    expect(exitButton).toBeTruthy();
    exitButton.click();
    fixture.detectChanges();

    expect(exitSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.menuOpen()).toBe(false);
  });

  it('closes the menu when clicking outside the component', () => {
    const fixture = TestBed.createComponent(TopBar);
    fixture.detectChanges();
    fixture.componentInstance.toggleMenu();
    fixture.detectChanges();
    expect(fixture.componentInstance.menuOpen()).toBe(true);

    document.body.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.menuOpen()).toBe(false);
  });
});
