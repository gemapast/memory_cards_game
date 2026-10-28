import { TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();
  });

  it('renders a native button element', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button).toBeTruthy();
  });

  it('applies the primary variant class by default', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.className).toContain('btn-primary');
  });

  it('applies the secondary variant class', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.variant = 'secondary';
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.className).toContain('btn-secondary');
  });

  it('reflects the type and disabled inputs', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.type = 'submit';
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(true);
  });

  it('emits buttonClick when clicked', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();

    const clicked = vi.fn();
    fixture.componentInstance.buttonClick.subscribe(clicked);
    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(clicked).toHaveBeenCalled();
  });

  it('does not emit buttonClick when disabled', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const clicked = vi.fn();
    fixture.componentInstance.buttonClick.subscribe(clicked);
    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(clicked).not.toHaveBeenCalled();
  });
});
