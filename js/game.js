/// <reference path="./types/index.d.ts" />

class MainScreen extends Phaser.Scene {
  constructor(title) {
    super(title);
  }

  preload() {
    this.load.image("tiles", "../assets/map32pixel.png");
    this.load.tilemapTiledJSON("map", "../assets/map.json");
    this.load.spritesheet('player', 'assets/player_spritesheet.png', {
      frameWidth: 15,
      frameHeight: 24,
      margin: 1,
      spacing: 1
    });

    this.load.audio('ambientSong', ['music', 'assets/Worldmusic.mp3']);
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiledset", "tiles");
    const music = this.sound.add('ambientSong');

    music.play();

    const belowLayer = map.createLayer("Ground", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above", tileset, 0, 0);
    this.player = this.physics.add.sprite(200, 300, 'player', 1);
    this.player.setScale(1.5, 1.5);

    worldLayer.setCollisionByProperty({ collides: true });

    aboveLayer.setDepth(10);

    this.physics.add.collider(this.player, this.worldLayer);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }
    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }
  }

}

const mainScreen = new MainScreen('game')

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 640,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: mainScreen,
};

function start() {
  const gameObject = new Phaser.Game(config);
  document.getElementById("startButton").hidden = true;
}