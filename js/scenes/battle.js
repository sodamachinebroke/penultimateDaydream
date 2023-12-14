/// <reference path="../types/index.d.ts" />

class BattleScene extends Phaser.Scene {
    constructor(title) {
        super({ key: title });
    }

    preload() {

    }

    create() {
        this.initializeBasics();
        const mainScreen = this.scene.get('game');
        const player = mainScreen.player;

        this.createEnemyGroup();


        this.player = this.physics.add.sprite(600, 300, "player", 10);
        this.player.setScale(3, 3);


        this.battleMenu();
    }
    createEnemyGroup() {
        this.enemyGroup = this.physics.add.group({
            key: 'enemy',
            repeat: 2,
            setXY: {
                x: 100,
                y: 200,
                stepY: 100
            },
            createCallback: function (enemy) {
                enemy.setScale(3, 3);
            }
        });
    }

    battleMenu() {

        this.battleMenuContainer = this.add.container(20, this.game.config.height - 200);
        const bMenuBG = this.add.rectangle(0, 0, 760, 120, 0x000000, 0.5);
        bMenuBG.setOrigin(0, 0);

        this.battleMenuContainer.add(bMenuBG);

        const buttonTexts = ['Attack', 'Heal', 'Flee'];
        buttonTexts.forEach((text, index) => {

            const button = this.add.text(
                600,
                20 + index * 30,
                text,
                {
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    fontSize: '20px',
                }
            );
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => {
                this.handleButtonClick(text);
            });
            this.battleMenuContainer.add(button);
        });



    }

    handleButtonClick(buttonText){
        switch(buttonText){
        case 'Attack':
            break;
        case 'Heal':
            break;
        case 'Flee':
            this.bMusic.stop();
            this.cameras.main.fadeOut(500);
            this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>{
                this.scene.start('game', {
                    x:130,
                    y:220
                });
            });
            
            break;

        default:
            break;
        }
    }

    initializeBasics() {
        this.cameras.main.fadeIn(1000);
        this.bg = this.add.sprite(0, 0, 'battleBG');
        this.bg.setOrigin(0, 0);
        this.bg.setDisplaySize(800, 640);

        this.bMusic = this.sound.add('battlesong');
        this.bMusic.setVolume(0);

        this.tweens.add({
            targets: this.bMusic,
            volume: 0.1,
            duration: 5000,
            ease: 'Linear'
        });
        this.bMusic.play();
    }

}