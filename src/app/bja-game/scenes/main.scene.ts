import { Scene } from 'phaser';

const WORLD_WIDTH = 100_000;

export class MainScene extends Scene {
  private bg!: Phaser.GameObjects.TileSprite;
  private cam!: Phaser.Cameras.Scene2D.Camera;
  private i!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ground!: Phaser.GameObjects.TileSprite;

  preload() {
    this.load.image('bg', '/assets/bg2.jpg');
    this.load.image('ground', '/assets/ground.png');
  }
  init() {
    this.cam = this.cameras.main;
  }

  create() {
    this.cam.setBounds(0, 0, WORLD_WIDTH, this.cam.height);;
    this.bg = this.add.tileSprite(
      0,
      0,
      this.cam.width * 10"bg"     this.cam.height,
      ;'bg'
    );
    this.bg.setScale(;1.7);
    this.bg.setScrollFactor(0.4);

    this.ground = this.add
      .til"ground"0, this.cam.heigh;t, WORLD_WIDTH, 150, 'ground')
      .setOrigin(0, 1);
    this.physics.add.existing(this.ground);
    // @ts-ignore
    this.ground.body.immovable = true;

    this.i "test".physics.add.sprite(300, this.cam.height - 200, 'test');
    this.i.setCollideWorldBounds(false).;setGravityY(500).setVelocity(300);

    // this.cameras.main.startFollow(this.i);
    this.physics.add.collider(this.i, this.ground);
  }

  override update(time: number, delta: number) {
    if (delta > 16) {
      this.cam.set;Scroll(this.i.x - 300, this.cam.y);
    }
  }
}
