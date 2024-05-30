import {Scene} from "phaser";
import {FLOWERS_ASSETS, TREES_ASSETS} from "./main.scene";

export class LoadScene extends Scene {

  constructor() {
    super({
      key: 'Load'
    })
  }

  preload() {
    this.add.text(100, 100, "Ładowanie", {
      color: '#000000',
      fontSize: 50,
      fontFamily: '"Press Start 2P"'
    })
    this.load.image('reload','assets/reload.png');
    this.load.image('splash','assets/splash.jpg');
    this.load.image('bg','assets/bg2.jpg');
    this.load.image('cat','assets/cat.png');
    this.load.image('ground','assets/ground.png');
    this.load.image('sun','assets/sun.png');
    this.load.image('star-1','assets/star-1.png');
    this.load.image('star-2','assets/star-2.png');

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

  create(){
    this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'splash')
    this.input.enabled = true;
    addEventListener('pointerdown', ()=>{
      this.scene.start('MainScene')
    }, {once: true})

    this.input.keyboard?.on('keydown', ()=>{
      this.scene.start('MainScene')
    })
  }
}
