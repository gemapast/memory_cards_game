import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'es' | 'en';
export const SUPPORTED_LANGS: Lang[] = ['es', 'en'];

const STORAGE_KEY = 'memory-cards:lang';
const DEFAULT_LANG: Lang = 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly langSignal = signal<Lang>(this.readFromStorage() ?? DEFAULT_LANG);
  readonly lang = this.langSignal.asReadonly();

  constructor() {
    this.translateService.use(this.langSignal()).subscribe();
  }

  setLang(lang: Lang): void {
    if (lang === this.langSignal()) {
      return;
    }

    this.langSignal.set(lang);
    this.writeToStorage(lang);
    this.translateService.use(lang).subscribe();
  }

  private readFromStorage(): Lang | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === 'es' || raw === 'en' ? raw : null;
    } catch {
      return null;
    }
  }

  private writeToStorage(lang: Lang): void {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      //
    }
  }
}
