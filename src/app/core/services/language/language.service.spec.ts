import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
  });

  it('defaults to Spanish when there is no stored preference', () => {
    const service = TestBed.inject(LanguageService);

    expect(service.lang()).toBe('es');
  });

  it('restores the persisted language from localStorage', () => {
    localStorage.setItem('memory-cards:lang', 'en');

    const service = TestBed.inject(LanguageService);

    expect(service.lang()).toBe('en');
  });

  it('changes and persists the language', () => {
    const service = TestBed.inject(LanguageService);
    const translateService = TestBed.inject(TranslateService);
    const useSpy = vi.spyOn(translateService, 'use');

    service.setLang('en');

    expect(service.lang()).toBe('en');
    expect(localStorage.getItem('memory-cards:lang')).toBe('en');
    expect(useSpy).toHaveBeenCalledWith('en');
  });

  it('does nothing when setting the already active language', () => {
    const service = TestBed.inject(LanguageService);
    const translateService = TestBed.inject(TranslateService);
    const useSpy = vi.spyOn(translateService, 'use');

    service.setLang('es');

    expect(useSpy).not.toHaveBeenCalled();
  });
});
