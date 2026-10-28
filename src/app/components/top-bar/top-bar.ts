import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  imports: [TranslatePipe],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBar {
  @Input() playerName = '';
  @Output() readonly exit = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly menuOpen = signal(false);

  playerInitial(): string {
    return this.playerName.trim().charAt(0).toUpperCase() || '?';
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  onExit(): void {
    this.menuOpen.set(false);
    this.exit.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }
}
