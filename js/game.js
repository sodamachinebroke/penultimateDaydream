/// <reference path="./types/index.d.ts" />

/*We don't need any code here, this just needs to include the classes*/
const battleScene = new BattleScene("battlescene");
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
  scene: [mainMenu, mainScreen, battleScene],
};
const gameObject = new Phaser.Game(config);