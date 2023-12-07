/// <reference path="./types/index.d.ts" />

class MainScreen extends Phaser.Scene {
  constructor(title) {
    super(title);
  }

  preload() {
    this.load.image("tiles", "../assets/images/map32pixel.png");
    this.load.tilemapTiledJSON("map", "../assets/map.json");
    this.load.spritesheet("player", "assets/images/player_spritesheet.png", {
      frameWidth: 15,
      frameHeight: 24,
      margin: 1,
      spacing: 1,
    });

    this.load.audio("song", ["music", "assets/music/Worldmusic.mp3"]);
  }

  create() {
    this.movementAnim = 'stop';
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiledset", "tiles");
    const music = this.sound.add("song");
    music.volume = 0.1;
    music.play();

    const belowLayer = map.createLayer("Ground", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above", tileset, 0, 0);
    this.player = this.physics.add.sprite(200, 300, "player", 2);
    this.player.setScale(1.5, 1.5);

    worldLayer.setCollisionByProperty({ collides: true });

    aboveLayer.setDepth(10);

    this.physics.add.collider(this.player, this.worldLayer);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();
    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      if (this.movementAnim !== 'left') {
        this.movementAnim = 'left';
        this.player.play("left");
        this.player.flipX = false;
      }
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      if (this.movementAnim !== 'rigth') {
        this.movementAnim = 'rigth';
        this.player.flipX = true;
        this.player.play("right");
      }
    }

     if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      if (this.movementAnim !== 'up') {
        this.movementAnim = 'up';
        this.player.play("up");
      }
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      if (this.movementAnim !== 'down') {
        this.movementAnim = 'down';
        this.player.play("down");
      }
    }

    if(this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.stop();
    }
  }
}

class MainMenu extends Phaser.Scene {
  constructor(title) {
    super(title);
  }
  preload() {}
  create() {}
  update() {}
}

const mainScreen = new MainScreen("game");

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
