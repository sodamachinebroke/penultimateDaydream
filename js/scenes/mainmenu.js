/// <reference path="../types/index.d.ts" />

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
      const name1 = this.add.text(50, 150, "Érsek Norbert IIJU0Z", { fontSize: "64px", fill: "#000" , strokeThickness : 5, });
      const name2 = this.add.text(50, 250, "Kacsir András", { fontSize: "64px", fill: "#000" , strokeThickness : 5, });
      const name3 = this.add.text(50, 350, "Pogonyi Ábel TR6FKP", { fontSize: "64px", fill: "#000" , strokeThickness : 5, });
  
      const elements = [backButton,title , name1, name2, name3]
      this.onHover(backButton, backButton);
      backButton.on("pointerdown", () => {
        this.setVisibility(true);
        elements.forEach(element => {element.setVisible(false);});
      });
    }
  
    update(){
  
    }
  }