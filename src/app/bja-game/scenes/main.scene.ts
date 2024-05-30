import { Scene } from 'phaser';

export const WORLD_WIDTH = 10000;
export const FLOWERS_ASSETS = 11;
export const TREES_ASSETS = 5;
export const OBJECT_COUNT = Math.floor(WORLD_WIDTH/300);

const FLOWERS_ORDER_ARRAY = new Array(FLOWERS_ASSETS).fill(0).map((el,i)=>i+1)
shuffle(FLOWERS_ORDER_ARRAY)
console.log(FLOWERS_ORDER_ARRAY)

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export class MainScene extends Scene {
  private gameOver = false;

  constructor() {
    super({
      key: 'MainScene'
    });
  }
  private bg!: Phaser.GameObjects.TileSprite;
  private cam!: Phaser.Cameras.Scene2D.Camera;
  private i!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ground!: Phaser.GameObjects.TileSprite;
  private ground2!: Phaser.GameObjects.TileSprite;
  private yPos!: number;
  private timedEvent!: Phaser.Time.TimerEvent;
  private initialTime = 30;
  private timeText!: Phaser.GameObjects.Text;
  private pointsText!: Phaser.GameObjects.Text;
  private points = 0;

  preload() {

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
      const flower = this.physics.add.image(lastPos,this.yPos, `flower-${FLOWERS_ORDER_ARRAY[lastFlower-1]}`);
      flower.setOrigin(0.5,1)
      flower.setScale(0.9 + (0.001*i))
      // @ts-ignore
      flower.tex = `flower-${FLOWERS_ORDER_ARRAY[lastFlower]}`
      this.physics.add.collider(this.i, flower, ()=>{
        // @ts-ignore
        console.log(flower.tex)
        flower.disableBody();
        this.sound.play('hit', {
          volume: 3
        });

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

      console.log(getRandomArbitrary(1,2))

      const star  = this.physics.add.sprite(lastPos+(-300*Math.random()+200), (this.cam.height - Math.random()*200) - 180, `star-${getRandomArbitrary(1,2)}`).setDepth(1000)
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

        this.points++;
        this.pointsText.setText(`Punkty: ${this.points}`)
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
    this.bg.setAlpha(0.6)

    this.ground= this.add.tileSprite(0,this.cam.height+80,WORLD_WIDTH,150, 'ground').setOrigin(0,1).setDepth(300)
    this.ground2= this.add.tileSprite(0,this.cam.height+50,WORLD_WIDTH,150, 'ground').setOrigin(0,0.8).setDepth(300)
    this.ground2.setScale(1,1.6)

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

    addEventListener('pointerdown', ()=>{
      this.jump();

    }, )

    this.input.on('pointerdown', ()=>{
    })

    this.placeObjects();

    const sun = this.add.sprite(this.cam.width-150, 150, 'sun').setScrollFactor(0).setDepth(50)
    this.add.tween({
      targets:[sun],
      angle: 360,
      repeat: -1,
      duration: 7000,
    })

    this.timeText = this.add.text(32, 132, 'Czas: ' +(this.initialTime), {
      fontSize: 60,
      shadow: {
        color: '#173261',
        offsetX:1,
        offsetY: 1,
        blur: 2,
        fill: true
      },
      fontFamily: '"Press Start 2P"'
    }).setScrollFactor(0);
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
    this.pointsText = this.add.text(32, 32, 'Punkty: ' +(this.points),{
      fontSize: 60,
      shadow: {
        color: '#173261',
        offsetX:1,
        offsetY: 1,
        blur: 2,
        fill: true
      },
      fontFamily: '"Press Start 2P"'
    }).setScrollFactor(0);
  }

   onEvent ()
  {
    this.initialTime -= 1; // One second
    this.timeText.setText('Czas: ' + (this.initialTime));
    if(this.initialTime<0) {
      this.timedEvent.destroy()
      this.timeText.destroy()
      this.add.image(700,400,'reload').setScrollFactor(0).setDepth(1000)
      this.game.pause();
      this.gameOver = true;
    }
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
    if(this.gameOver) {
      location.reload();
      return
    }

    if(Math.abs(this.i.y)<650) {
      return
    }
    this.sound.play('jump')
    this.i.setVelocityY(-750);
  }
}
function getRandomArbitrary(min: number, max:number) {
  return Math.round(Math.random() * (max - min) + min);
}
