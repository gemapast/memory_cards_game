import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Lang,
  LanguageService,
  SUPPORTED_LANGS,
} from '../../core/services/language/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  protected readonly languageService = inject(LanguageService);
  protected readonly languages = SUPPORTED_LANGS;

  isActive(lang: Lang): boolean {
    return this.languageService.lang() === lang;
  }
}
