/// <reference path="../types/index.d.ts" />

class BattleScene extends Phaser.Scene {
    constructor(title) {
        super({ key: title });
    }

    preload() {

    }

    create() {

        this.registry.set('enemyIndex', -1);
        this.initializeBasics();
        const mainScreen = this.scene.get('game');
        const player = mainScreen.player;

        
        this.playerHealth = 50;


        this.player = this.physics.add.sprite(600, 300, "player", 10);
        this.player.setScale(3, 3);


        this.battleMenu();
        this.createEnemyGroup();
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
                enemy.setScale(0.4, 0.4);
                enemy.health = 10;
            }
        });
        let enemyCount = 0;

        /*Let's make a button for every enemy*/
        this.enemyGroup.children.iterate((enemy, index) => {
            enemyCount++;
            const enemyButton = this.add.text(
                50,
                20 + index * 30,
                `Enemy ${enemyCount} - HP: ${enemy.health}`,
                {
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    fontSize: '20px',
                }
            );
            enemyButton.setInteractive({ useHandCursor: true });
            enemyButton.on('pointerdown', () => {
                this.handleEnemyButtonClick(index);
            });

            this.battleMenuContainer.add(enemyButton);
        });


    }

    handleEnemyButtonClick(enemyIndex) {


        this.registry.set('enemyIndex', enemyIndex);
        this.battleMenuContainer.list.slice(4, 7).forEach((enemyButton, index) => {

            if (index != this.registry.get('enemyIndex'))
                this.tweens.add({
                    targets: enemyButton,
                    scaleX: 1,
                    scaleY: 1,

                });
        });


        // Get the selected enemy button and apply a tween to highlight it
        const selectedEnemyButton = this.battleMenuContainer.getAt(enemyIndex + 4);
        if (selectedEnemyButton) {
            this.selectEnemy = this.tweens.add({
                targets: selectedEnemyButton,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 500,
                ease: 'Linear',
            });
        }
    }
    battleFunction() {

        for (this.turn = 0; this.turn < 4; this.turn++) {
            switch (this.turn % 4) {
                case 0:
                    const selectedEnemyIndex = this.registry.get('enemyIndex');
                    if (selectedEnemyIndex !== -1) {
                        this.playerAttack(selectedEnemyIndex);
                    }
                    break;
                case 1:
                    this.enemyAttack(0);
                    break;
                case 2:
                    this.enemyAttack(1);
                    break;
                case 3:
                    this.enemyAttack(2);
                    break;

                default:
                    break;
            }

            console.log("Turn mod 4: " + this.turn);
        }
    }


    
    playerAttack(enemyIndex) {
        console.log('Player attacks enemy: ' + (enemyIndex + 1));

        const selectedEnemy = this.enemyGroup.getChildren()[enemyIndex];

        if (selectedEnemy) {
            const damage = Phaser.Math.Between(1, 10);
            selectedEnemy.health -= damage;
            console.log(`Player dealt: ${damage} to enemy ${enemyIndex + 1} - HP: ${selectedEnemy.health}`);
            const enemyButton = this.battleMenuContainer.getAt(enemyIndex+4);
            if(enemyButton){
                enemyButton.setText(`Enemy ${enemyIndex+1} - HP: ${selectedEnemy.health}`);
            }
        }
    }

    enemyAttack(enemyIndex){
        //console.log('Enemy ' + (enemyIndex + 1) + ' attacks');
        const damage = Phaser.Math.Between(1,10);
        console.log(`Initial player health: ${this.playerHealth}`);
        this.playerHealth -= damage;
        console.log(`Enemy dealt: ${damage} to the player- Player HP: ${this.playerHealth}`);
    }


    battleMenu() {

        this.battleMenuContainer = this.add.container(20, this.game.config.height - 200);
        const bMenuBG = this.add.rectangle(0, 0, 760, 120, 0x000000, 0.5);
        bMenuBG.setOrigin(0, 0);

        this.battleMenuContainer.add(bMenuBG);

        this.playerHealthText = this.add.text(20, 20, `Player Health: ${this.playerHealth}`,{
            fill: '#ffffff',
            fontFamily:'Arial',
            fontSize: '20px',
        });

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

    handleButtonClick(buttonText) {
        switch (buttonText) {
            case 'Attack':
                this.battleFunction();
                break;
            case 'Heal':
                break;
            case 'Flee':
                this.bMusic.stop();
                this.cameras.main.fadeOut(500);
                this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('game', {
                        x: 130,
                        y: 220
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