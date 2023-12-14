/// <reference path="../types/index.d.ts" />

class MainScreen extends Phaser.Scene {
  constructor(title) {
    super(title);
    this.defaultPlayerX = 200;
    this.defaultPlayerY = 300;
  }
  init(data) {
    this.defaultPlayerX = data && data.x ? data.x : 200;
    this.defaultPlayerY = data && data.y ? data.y : 300;
  }

  preload() {
    this.loadAssets();
  }


  /*This boi loads every asset needed*/
  loadAssets() {
    this.load.image("tiles", "../assets/images/map32pixel.png");
    this.load.tilemapTiledJSON("map", "../assets/map.json");
    this.load.spritesheet("player", "assets/images/player_spritesheet.png", {
      frameWidth: 15,
      frameHeight: 24,
      margin: 1,
      spacing: 1,
    });

    /*THIS ENEMY IS A PLACEHOLDER*/
    this.load.spritesheet("enemy", "assets/images/enemy_placeholder.png", {
      frameWidth: 15,
      frameHeight: 24,
      margin: 1,
      spacing: 1
    })

    /*We load the stuff needed for battles too, because it's simpler this way*/
    this.load.image('battleBG', 'assets/images/battleBG.png');


    this.load.audio("battlesong", ["battlemusic", "assets/music/Battle.mp3"])
    this.load.audio("song", ["music", "assets/music/Worldmusic.mp3"]);
  }


  create() {
    this.movementAnim = 'stop';
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiledset", "tiles");
    this.music = this.sound.add("song");
    this.music.setVolume(0);
    this.tweens.add({
      targets: this.music,
      volume: 0.2,
      duration: 5000,
      ease: 'Linear'
    });
    this.music.play();

    const belowLayer = map.createLayer("Ground", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above", tileset, 0, 0);
    this.player = this.physics.add.sprite(this.defaultPlayerX, this.defaultPlayerY, "player", 2);
    this.player.setScale(1.5, 1.5);

    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);

    this.physics.add.collider(this.player, worldLayer);

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

  inRadius(x, y, radius) {
    const dist = Math.sqrt((this.player.x - x) ** 2 + (this.player.y - y) ** 2);
    return dist <= radius;
  }

  update() {

    this.canMove = true;
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();
    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);

    // check if player is in a specific area

    const coord = { 'castle': [622, 241], 'cave': [80, 171], 'forest': [302, 370] }

    if (this.inRadius(coord.castle[0], coord.castle[1], 50)) {
      console.log("castle");
    }
    if (this.inRadius(coord.cave[0], coord.cave[1], 50)) {
      this.canMove = false;
      this.music.stop();
      this.scene.start('battlescene');
    }
    if (this.inRadius(coord.forest[0], coord.forest[1], 50)) {
      console.log("forest");
    }

    // Horizontal movement
    if (this.canMove) {
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
    }
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.stop();
    }
  }
}