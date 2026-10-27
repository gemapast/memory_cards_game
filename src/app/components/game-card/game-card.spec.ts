import { TestBed } from '@angular/core/testing';
import { GameCard } from './game-card';

describe('GameCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCard],
    }).compileComponents();
  });

  it('hides the value while the cell is hidden', () => {
    const fixture = TestBed.createComponent(GameCard);
    fixture.componentInstance.cell = { position: 0, value: 7, state: 'hidden' };
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.textContent?.trim()).toBe('');
    expect(button.disabled).toBe(false);
  });

  it('shows the value and disables the button once revealed', () => {
    const fixture = TestBed.createComponent(GameCard);
    fixture.componentInstance.cell = { position: 0, value: 7, state: 'correct' };
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.textContent?.trim()).toBe('7');
    expect(button.disabled).toBe(true);
  });

  it('emits the position when a hidden cell is clicked', () => {
    const fixture = TestBed.createComponent(GameCard);
    fixture.componentInstance.cell = { position: 4, value: 3, state: 'hidden' };
    fixture.detectChanges();

    const selected = vi.fn();
    fixture.componentInstance.select.subscribe(selected);

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(selected).toHaveBeenCalledWith(4);
  });

  it('does not emit when disabled', () => {
    const fixture = TestBed.createComponent(GameCard);
    fixture.componentInstance.cell = { position: 4, value: 3, state: 'hidden' };
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const selected = vi.fn();
    fixture.componentInstance.select.subscribe(selected);

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(selected).not.toHaveBeenCalled();
  });
});
