/*We don't currently use this file, but it can be used as a backup*/

/// <reference path="../types/index.d.ts" />

class BattleScene extends Phaser.Scene {
    constructor(title) {
        super({ key: title });
    }

    preload() {

    }

    create() {

        this.initializeBasics();

        /*Player health is reset in every battle. Let's say they like ate a magic mushroom or smth between battles idk*/
        this.playerHealth = 50;
        this.player = this.physics.add.sprite(600, 300, "player", 10);
        this.player.setScale(3, 3);

        this.battleMenu();
        this.createEnemyGroup();
    }

    battleMenu() {

        this.battleMenuContainer = this.add.container(20, this.game.config.height - 200);
        const bMenuBG = this.add.rectangle(220, 0, 460, 120, 0x000000, 0.5);
        bMenuBG.setOrigin(0, 0);
        this.battleMenuContainer.add(bMenuBG);

        /*Right side of the screen*/
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

        /*Player health display*/
        const playerHealthText = this.add.text(300, 50, `Player Health: ${this.playerHealth}`, {
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontSize: '20px',
        });

        playerHealthText.setOrigin(0, 0);
        this.battleMenuContainer.add(playerHealthText);

    }

    createEnemyGroup() {

        // Create a group of enemies
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
                enemy.baseHealth = 10;
                enemy.currentHealth = 10;
                enemy.defeated = false;
            }
        });

        // Set enemies properties
        this.enemyGroup.getChildren().forEach((enemy) =>  {

            enemy.setInteractive();
            enemy.on('pointerdown', () => {
                this.selectedEnemy = enemy;
                this.enemyGroup.getChildren().forEach((enemy) =>  {
                    enemy.clearTint();
                });
                enemy.setTint(0xff0000);
            });
            enemy.on('pointerover', () => {
                if(enemy !== this.selectedEnemy)
                    enemy.setTint(0x7878ff);
            });
            enemy.on('pointerout', () => {
                if(enemy !== this.selectedEnemy)
                    enemy.clearTint();
            });

            enemy.tweenAttack = this.tweens.add({
                targets: enemy,
                paused: true,
                x: this.player.x - 50,
                y: this.player.y,
                duration: 500,
                ease: 'Expo.out',
                yoyo: true,
                persist: true,
            });

            enemy.healthBar = this.makeBar(enemy.x-25, enemy.y-60, 0xff0000);
        });
    }
    
    makeBar(x, y, color) {
        //draw a healthbar
        let bar = this.add.graphics();

        bar.fillStyle(color, 1);

        bar.fillRect(0, 0, 64, 8);

        bar.x = x;
        bar.y = y;

        return bar;
    }

    setHealthBarValue(bar, baseHealth, currentHealth) {
        bar.scaleX = currentHealth / baseHealth;
    }

    battleFunction() {
        this.currentTurn = 'PLAYER';

        const executeTurn = () => {

            switch (this.currentTurn) {
                case 'PLAYER':
                    this.playerAttack();
                    this.time.delayedCall(2000, executeTurn, [], this);
                    break;
                case 'ENEMY':
                    this.enemyTurn();
                    break;
                default:
                    break;
            }
        };

        // Start the turn sequence
        executeTurn();
    }

    playerAttack() {
        let selectedEnemy = this.selectedEnemy;

        if (!selectedEnemy) {
            this.splashText.setText('No enemy selected!');
            return;
        }

        this.tweens.add({
            targets: this.player,
            x: selectedEnemy.x + 50,
            y: selectedEnemy.y,
            duration: 500,
            yoyo: true,
            ease: 'Expo.out',
        });


        let damage = Phaser.Math.Between(1, 10);
        selectedEnemy.currentHealth -= damage;
        selectedEnemy.clearTint();

        if(selectedEnemy.currentHealth <= 0){
            selectedEnemy.healthBar.destroy();
            selectedEnemy.destroy();
        } else{
            this.setHealthBarValue(selectedEnemy.healthBar, selectedEnemy.baseHealth, selectedEnemy.currentHealth);
        }
        if(this.enemyGroup.getChildren().length === 0){
            this.playerWon();
        }else{
            this.currentTurn = 'ENEMY';
        }
    }

    playerWon() {
        this.bMusic.stop();
        this.currentTurn = 'OVER';
        const rect = new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height);

        this.add.particles(400, 250, 'flares', {
            frame: [ 'red', 'yellow', 'green' ],
            lifespan: 4000,
            speed: { min: 150, max: 250 },
            scale: { start: 0.4, end: 0 },
            gravityY: 150,
            bounce: 0.8,
            bounds: rect,
            blendMode: 'ADD'
        });

        const graphics = this.add.graphics();
        this.sound.play('win');
        this.sound.volume = 0.5;

        graphics.lineStyle(1, 0x000000, 0);
        graphics.strokeRectShape(rect);


    }

    playerLose(){
        this.bMusic.stop();
        this.sound.play('lose');
        this.sound.volume = 0.5;

        this.cameras.main.fade(2000, 255, 0, 0, false, (camera, progress) => {
            if(progress === 1){
                this.scene.start('mainmenu', {
                    x: 130,
                    y: 220
                });
            }
        });
    }

    enemyTurn() {

        for (let i = 0; i < this.enemyGroup.getChildren().length; i++) {
            this.time.delayedCall(i*800, this.enemyAttack, [this.enemyGroup.getChildren()[i]], this);
        }
        this.currentTurn = 'PLAYER';
        this.selectedEnemy = null;
    }

    enemyAttack(enemy ) {

        const damage = Phaser.Math.Between(1, 10);

        this.playerHealth -= damage;
        const playerHealthText = this.battleMenuContainer.getAt(4);
        if (playerHealthText) {
            playerHealthText.setText(`Player Health: ${this.playerHealth}`);
        }
        enemy.tweenAttack.play();

        if(this.playerHealth <= 0){
            this.playerLose();
        }
    }

    /*Function to break the 4th wall, used to display information. Is kind of similar to a Minecraft function.*/

    displaySplashText(text) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.splashText.setText(text);
        this.splashText.setPosition(centerX, centerY);
        this.splashText.setVisible(true);

        setTimeout(() => {
            this.clearMessages();
        }, 2000);
    }

    /*Yeah need this to clear the message after 2 seconds, cause Js doesn't have a wait function*/
    clearMessages() {
        this.splashText.setVisible(false);
    }

    /*By far the simplest function lol*/
    playerHeal() {
        this.playerHealth += 10;
        const playerHealthText = this.battleMenuContainer.getAt(4);
        if (playerHealthText) {
            playerHealthText.setText(`Player Health: ${this.playerHealth}`);
        }

    }

    /*Basically this is the interaction menu for the player. It's named weirdly because i could not bother*/
    handleButtonClick(buttonText) {

        switch (buttonText) {
            case 'Attack':
                if (this.selectedEnemy ) {
                    this.battleFunction();
                } else {
                    this.displaySplashText('No enemy selected!');
                }
                break;
            case 'Heal':
                if (this.playerHealth <= 40) {
                    this.playerHeal();
                } else {
                    this.displaySplashText('Cannot overheal!');
                }

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

    /*This runs first, it initializes the scene*/
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

        this.splashText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'No valid enemy selected!',
            {
                fill: '#fc0000',
                fontFamily: 'Arial',
                fontSize: '48px',
            }
        );
        this.splashText.setOrigin(0.5);
        this.splashText.setVisible(false);
    }

}