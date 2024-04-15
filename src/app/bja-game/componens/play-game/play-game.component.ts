import { Component, OnInit } from '@angular/core';
import { BjaGame } from '../../classes/bja-game.class';
import { MainScene } from '../../scenes/main.scene';

@Component({
  selector: 'play-game',
  templateUrl: './play-game.component.html',
  styleUrl: './play-game.component.scss',
})
export class PlayGameComponent implements OnInit {
  private game!: BjaGame;

  ngOnInit() {
    this.game = new BjaGame({
      scene: MainScene,
    });
  }
}
