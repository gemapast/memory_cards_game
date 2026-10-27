import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DifficultySelector } from './difficulty-selector';

describe('DifficultySelector', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DifficultySelector, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('renders the three difficulty options', () => {
    const fixture = TestBed.createComponent(DifficultySelector);
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.difficulty-selector__button',
    );
    expect(buttons.length).toBe(3);
  });

  it('emits the selected difficulty when a button is clicked', () => {
    const fixture = TestBed.createComponent(DifficultySelector);
    fixture.detectChanges();

    const selected = vi.fn();
    fixture.componentInstance.selectDifficulty.subscribe(selected);

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.difficulty-selector__button',
    );
    (buttons[1] as HTMLButtonElement).click();

    expect(selected).toHaveBeenCalledWith('normal');
  });

  it('disables the buttons when disabled is true', () => {
    const fixture = TestBed.createComponent(DifficultySelector);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '.difficulty-selector__button',
    )!;
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables the start button when canStart is false', () => {
    const fixture = TestBed.createComponent(DifficultySelector);
    fixture.componentInstance.canStart = false;
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    const startButton = buttons[buttons.length - 1] as HTMLButtonElement;
    expect(startButton.disabled).toBe(true);
  });

  it('emits start when the start button is clicked', () => {
    const fixture = TestBed.createComponent(DifficultySelector);
    fixture.componentInstance.canStart = true;
    fixture.detectChanges();

    const started = vi.fn();
    fixture.componentInstance.start.subscribe(started);

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    const startButton = buttons[buttons.length - 1] as HTMLButtonElement;
    startButton.click();

    expect(started).toHaveBeenCalled();
  });
});
