import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameInfo } from './game-info';

describe('GameInfo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameInfo, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('displays the difficulty, time remaining and score', () => {
    const fixture = TestBed.createComponent(GameInfo);
    fixture.componentInstance.difficulty = 'normal';
    fixture.componentInstance.timeRemaining = 4;
    fixture.componentInstance.score = 30;
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('DIFFICULTY_NORMAL');
    expect(text).toContain('4s');
    expect(text).toContain('30');
  });
});
