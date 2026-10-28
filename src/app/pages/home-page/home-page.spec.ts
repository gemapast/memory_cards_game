import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './home-page';
import { PlayerService } from '../../core/services/player/player.service';
import { LanguageService } from '../../core/services/language/language.service';

describe('HomePage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HomePage, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomePage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the language switcher and changes the language even without a registered player', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('app-language-switcher button');
    expect(buttons.length).toBe(2);

    const enButton = Array.from(buttons).find((button) => button.textContent?.trim() === 'en')!;
    enButton.click();
    fixture.detectChanges();

    expect(TestBed.inject(LanguageService).lang()).toBe('en');
  });

  it('should not register the player nor navigate when the name is invalid', () => {
    const fixture = TestBed.createComponent(HomePage);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    const playerService = TestBed.inject(PlayerService);

    fixture.componentInstance.nameControl.setValue('');
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.form.invalid).toBe(true);
    expect(playerService.player()).toBeNull();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should show a validation message when the field is touched and invalid', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.componentInstance.nameControl.setValue('a');
    fixture.componentInstance.nameControl.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('should register the player and navigate to /game on valid submit', () => {
    const fixture = TestBed.createComponent(HomePage);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    const playerService = TestBed.inject(PlayerService);

    fixture.componentInstance.nameControl.setValue('Ana');
    fixture.componentInstance.onSubmit();

    expect(playerService.player()).toEqual({ name: 'Ana' });
    expect(navigateSpy).toHaveBeenCalledWith('/game');
  });
});
