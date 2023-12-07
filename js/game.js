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
    //collision debug
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // worldLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

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
  
  preload(){
    this.load.image("mainmenu", "../assets/images/mainmenu.jpg");
    this.load.image("board", "../assets/images/wood21.png");
  }

  create(){
    
    const background = this.add.image(400, 320, "mainmenu");
    this.startButton = this.add.image(400, 160, "board").setInteractive();
    this.startText = this.add.text(300, 125, "Start", { fontSize: "64px", fill: "#000" , strokeThickness : 10, });
    this.creditButton = this.add.image(400, 320, "board").setInteractive();
    this.creditText = this.add.text(280, 285, "Credit", { fontSize: "64px", fill: "#000" , strokeThickness : 10, });


    this.startButton.setScale(0.8, 0.3);
    this.creditButton.setScale(0.8, 0.3);
    this.startButton.on("pointerdown", () => {
      this.scene.start("game");
    });
    this.onHover(this.startButton,this.startText);

    this.creditButton.on("pointerdown", () => {
      this.changeToCredit();
    });
    this.onHover(this.creditButton,this.creditText);
  }

  setVisibility(visible){
    this.startButton.setVisible(visible);
    this.startText.setVisible(visible);
    this.creditButton.setVisible(visible);
    this.creditText.setVisible(visible);
  }

  onHover(button, text){
    button.on("pointerover", () => {
      text.setColor("#1FFF00");
    });
    button.on("pointerout", () => {
      text.setColor("#000");
    });
  }

  changeToCredit(){
    this.setVisibility(false);
    const backButton = this.add.text(50, 550, "Back", { fontSize: "64px", fill: "#000" , strokeThickness : 10, }).setInteractive();
    const title = this.add.text(50, 50, "Játékot készítette:", { fontSize: "64px", fill: "#fff" , strokeThickness : 5, });
    const name1 = this.add.text(50, 150, "Érsek Norbert", { fontSize: "64px", fill: "#000" , strokeThickness : 5, });
    const name2 = this.add.text(50, 250, "Kacsir András", { fontSize: "64px", fill: "#000" , strokeThickness : 5, });
    const name3 = this.add.text(50, 350, "Pogonyi Ábel TR6FKP", { fontSize: "64px", fill: "#000" , strokeThickness : 5, });

    const elements = [backButton, name1, name2, name3]
    this.onHover(backButton, backButton);
    backButton.on("pointerdown", () => {
      this.setVisibility(true);
      elements.forEach(element => {element.setVisible(false);});
    });
  }

  update(){

  }
}

const mainScreen = new MainScreen("game");
const mainMenu = new MainMenu("mainmenu");

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
  scene: [mainMenu, mainScreen],
};
const gameObject = new Phaser.Game(config);