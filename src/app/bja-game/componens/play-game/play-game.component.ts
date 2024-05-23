import { Component, OnInit } from '@angular/core';
import { BjaGame } from '../../classes/bja-game.class';
import { MainScene } from '../../scenes/main.scene';
import ScaleModes = Phaser.Scale.ScaleModes;

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
      scale: {
        width: 1200,
        height: 800,
        mode: ScaleModes.FIT,
      },
      physics: {
        default: 'arcade'
      }
    });
  }
}
