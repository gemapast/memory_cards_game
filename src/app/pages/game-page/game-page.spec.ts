import { TestBed } from '@angular/core/testing';
import { GamePage } from './game-page';
import { PlayerService } from '../../core/services/player.service';

describe('GamePage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [GamePage],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GamePage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should display the registered player's name", () => {
    TestBed.inject(PlayerService).register('Ana');
    const fixture = TestBed.createComponent(GamePage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ana');
  });
});
