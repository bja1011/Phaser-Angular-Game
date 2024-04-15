import { Scene } from 'phaser';

export class MainScene extends Scene {
  init() {
    this.add.sprite(100, 100, 'test');
    console.log(this);
  }
}
