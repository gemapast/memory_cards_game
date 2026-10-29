import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService } from '../../core/services/player/player.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from '../../components/button/button';
import { LanguageSwitcher } from '../../components/language-switcher/language-switcher';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule, TranslatePipe, Button, LanguageSwitcher],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    }),
  });

  get nameControl(): FormControl<string> {
    return this.form.controls.name;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.playerService.register(this.form.getRawValue().name);
    this.router.navigateByUrl('/game');
  }

  loginAs(name: string): void {
    this.playerService.register(name);
    this.router.navigateByUrl('/game');
  }

  goToRanking(): void {
    this.router.navigateByUrl('/ranking');
  }
}
