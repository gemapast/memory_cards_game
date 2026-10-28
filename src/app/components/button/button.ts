import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonType = 'button' | 'submit';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;
  @Output() buttonClick = new EventEmitter<void>();

  get buttonClass(): string {
    return this.variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
  }

  onClick(): void {
    if (this.disabled) {
      return;
    }
    this.buttonClick.emit();
  }
}
