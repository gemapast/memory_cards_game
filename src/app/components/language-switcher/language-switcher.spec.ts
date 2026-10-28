import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from './language-switcher';
import { LanguageService } from '../../core/services/language/language.service';

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('renders one button per supported language', () => {
    const fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('marks the active language button as pressed', () => {
    const fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    const esButton = Array.from(buttons).find((button) => button.textContent?.trim() === 'es')!;
    expect(esButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('switches the active language when a button is clicked', () => {
    const fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    const enButton = Array.from(buttons).find((button) => button.textContent?.trim() === 'en')!;
    enButton.click();
    fixture.detectChanges();

    const languageService = TestBed.inject(LanguageService);
    expect(languageService.lang()).toBe('en');
    expect(enButton.getAttribute('aria-pressed')).toBe('true');
  });
});
