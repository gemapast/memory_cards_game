import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopBar } from './components/top-bar/top-bar';
import { PlayerService } from './core/services/player.service';
import { GameService } from './core/services/game.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly playerService = inject(PlayerService);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  onExit(): void {
    this.gameService.reset();
    this.playerService.clear();
    this.router.navigateByUrl('/home');
  }
}
