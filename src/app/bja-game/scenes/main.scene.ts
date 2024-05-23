import { Scene } from 'phaser';

const WORLD_WIDTH = 100_000;
const FLOWERS_ASSETS = 2;
const TREES_ASSETS = 1;
const OBJECT_COUNT = Math.floor(WORLD_WIDTH/1400);

export class MainScene extends Scene {
  private bg!: Phaser.GameObjects.TileSprite;
  private cam!: Phaser.Cameras.Scene2D.Camera;
  private i!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ground!: Phaser.GameObjects.TileSprite;
  private ground2!: Phaser.GameObjects.TileSprite;
  private yPos!: number;

  preload() {
    this.load.image('bg','assets/bg2.jpg');
    this.load.image('cat','assets/cat.png');
    this.load.image('ground','assets/ground.png');
    this.load.image('sun','assets/sun.png');
    this.load.image('star','assets/star.png');

    this.load.audio('music', [ 'assets/music.mp3' ]);
    this.load.audio('jump', [ 'assets/jump.mp3' ]);
    this.load.audio('collect', [ 'assets/collect.mp3' ]);
    this.load.audio('hit', [ 'assets/hit.mp3' ]);

    for(let i=1; i<=FLOWERS_ASSETS; i++) {
      this.load.image(`flower-${i}`,`assets/flower-${i}.png`);
    }
    for(let i=1; i<=TREES_ASSETS; i++) {
      this.load.image(`tree-${i}`,`assets/tree-${i}.png`);
    }
  }

  init() {
    this.cam = this.cameras.main;
    this.yPos = this.cam.height-80;
  }

  placeObjects() {
    let lastFlower = 1;
    let lastTree = 1;
    let lastPos = this.drawX() + 600;
    for(let i=0; i<OBJECT_COUNT; i++) {
      const flower = this.physics.add.image(lastPos,this.yPos, `flower-${lastFlower}`);
      flower.setOrigin(0.5,1)
      flower.setScale(0.6 + (0.001*i))
      this.physics.add.collider(this.i, flower, ()=>{
        flower.disableBody();
        this.sound.play('hit');
        this.add.tween({
          targets: [flower],
          angle: 100,
          duration: 600
        })
        this.i.setVelocityX(50)
      });
      flower.setDepth(400)
      lastPos = this.drawX()+lastPos+500;

      this.add.sprite(lastPos+300,this.yPos+20, `tree-${lastTree}`)
        .setOrigin(0.5,1)
        .setScale(1 + (Math.random()-0.5))
        .setScrollFactor(0.9)
        .setAlpha(0.8)
        .setDepth(60)

      const star  = this.physics.add.sprite(lastPos+(-100*Math.random()+200), (this.cam.height - Math.random()*200) - 150, 'star').setDepth(1000)
      star.setMass(0.15)
      this.physics.add.collider(this.i, star, ()=>{
        star.disableBody()
        this.sound.play('collect')
        this.add.tween({
          targets:[star],
          angle: 200,
          y: star.y-200,
          scale: 3,
          alpha: 0,
          duration: 1000
        })
      });


      lastFlower++;
      if(lastFlower > FLOWERS_ASSETS) {
        lastFlower = 1;
      }
      lastTree++;
      if(lastTree > TREES_ASSETS) {
        lastTree = 1;
      }
    }
  }

  drawX() {
    return Math.random()*500
  }

  create() {
    this.sound.play('music');
    this.cam.setBounds(0,0,WORLD_WIDTH,this.cam.height)
    this.bg = this.add.tileSprite(0, -50, WORLD_WIDTH, this.cam.height, 'bg');
    this.bg.setScale(2.5 )
    this.bg.setScrollFactor(0.4)

    this.ground= this.add.tileSprite(0,this.cam.height+80,WORLD_WIDTH,150, 'ground').setOrigin(0,1).setDepth(300)
    this.ground2= this.add.tileSprite(0,this.cam.height+50,WORLD_WIDTH,150, 'ground').setOrigin(0,1).setDepth(300)
    this.physics.add.existing(this.ground);
    // @ts-ignore
    this.ground.body.immovable = true;
    // @ts-ignore
    // this.ground.body.setFrictionX(1000000);

    this.i = this.physics.add.sprite(300, this.cam.height - 200, 'cat');
    this.i.setDepth(500)
    this.i.setScale(0.7)
    this.i
      .setCollideWorldBounds(false)
      .setGravityY(1000)
      .setVelocity(this.targetVelocity)

    this.physics.add.collider(this.i, this.ground);

    this.input.enabled = true;
    // @ts-ignore
    this.input.keyboard.on('keydown',  (event)=> {
      this.jump();
    });

    this.placeObjects();

    const sun = this.add.sprite(this.cam.width-150, 150, 'sun').setScrollFactor(0).setDepth(50)
    this.add.tween({
      targets:[sun],
      angle: 360,
      repeat: -1,
      duration: 7000
    })
  }

  targetVelocity = 300;
  override update(time: number, delta: number) {
    // if(delta > 16) {
    //   this.physics.world.update(time, delta)
      this.cam.setScroll(this.i.x - 300, this.cam.y)
      this.i.setVelocityX(Math.min(this.targetVelocity, this.i.body.velocity.x+10));
    // }
  }

  private jump() {
    if(Math.abs(this.i.y)<650) {
      return
    }
    this.sound.play('jump')
    this.i.setVelocityY(-700);
  }
}
function getRandomArbitrary(min: number, max:number) {
  return Math.random() * (max - min) + min;
}
