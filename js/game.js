/// <reference path="./types/index.d.ts" />
class MainScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScreen' });
  }



  preload() {                                                                     //Preload function here
    this.loadAssets();
  }

  create() {                                                                      //Create function here
    this.createMap();
    this.createPlayer();
    this.createLayers();
    this.createAudio();
    this.createInput();

    this.input.keyboard.on('keydown-B', () => {                                 // Start the BattleScene when the 'B' key is pressed for debugging purposes
      this.music.stop();
      this.scene.start('BattleScene');
    });
  }

  update() {                                                                      //Update function here
    this.handleInput();
  }

  loadAssets() {
    this.load.image('tiles', '../assets/map32pixel.png');
    this.load.tilemapTiledJSON('map', '../assets/map.json');
    this.load.spritesheet('player', 'assets/player_spritesheet.png', {
      frameWidth: 15,
      frameHeight: 24,
      margin: 1,
      spacing: 1,
    });
    this.load.image('battleBG', 'assets/battleBG.png');

    this.load.audio('battleSong', ['music', 'assets/battleMusic.mp3']);
    this.load.audio('ambientSong', ['music', 'assets/Worldmusic.mp3']);
  }

  createMap() {
    this.map = this.make.tilemap({ key: 'map' });
    const tileset = this.map.addTilesetImage('tiledset', 'tiles');
    this.belowLayer = this.map.createLayer('Ground', tileset, 0, 0);
    this.worldLayer = this.map.createLayer('World', tileset, 0, 0);
    this.aboveLayer = this.map.createLayer('Above', tileset, 0, 0);

    this.worldLayer.setCollisionByProperty({ collides: true });
    this.aboveLayer.setDepth(1);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(200, 300, 'player', 1);
    this.player.setScale(1.5, 1.5);
  }

  createLayers() {
    this.physics.add.collider(this.player, this.worldLayer);
  }

  createAudio() {
    this.music = this.sound.add('ambientSong');
    this.music.setVolume(0);

    this.tweens.add({
      targets: this.music,
      volume: 0.1,
      duration:4000,
      ease: 'Linear'
    });
    this.music.play();
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  handleInput() {
    const speed = 175;

    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }
  }
}


const battleScene = new BattleScene('BattleScene');

const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 640,
  parent: 'game-container',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [MainScreen, battleScene]
};

const game = new Phaser.Game(gameConfig);
