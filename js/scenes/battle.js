/// <reference path="../types/index.d.ts" />

class BattleScene extends Phaser.Scene {
    constructor(title) {
        super({ key: title });
    }

    // We need this to determine whether our guy can attack
    lockUi = false;
    playerHealth = 50;
    selectedEnemy;
    defeatedEnemies = 0;

    preload() {}

    create() {
        this.registry.set('enemyIndex', -1);
        this.initializeBasics();
        const mainScreen = this.scene.get('game');
        const player = mainScreen.player;

        this.player = this.physics.add.sprite(600, 300, "player", 10);
        this.player.setScale(3, 3);

        this.battleMenu();
        this.createEnemyGroup();

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
                enemy.defeated = false;
            }
        });
        let enemyCount = 0;

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
        this.battleMenuContainer.list.slice(5, 8).forEach((enemyButton, index) => {
            if (index !== this.registry.get('enemyIndex')) {
                this.tweens.add({
                    targets: enemyButton,
                    scaleX: 1,
                    scaleY: 1,
                });
            }
        });

        const selectedEnemyButton = this.battleMenuContainer.getAt(enemyIndex + 5);
        if (selectedEnemyButton) {
            this.selectEnemy = this.tweens.add({
                targets: selectedEnemyButton,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 500,
                ease: 'Linear',
            });

            this.selectedEnemy = this.enemyGroup.getChildren()[enemyIndex];
        }
    }

    battleFunction() {
        this.lockUi = true;
        const maxTurns = 4;
        let currentTurn = 0;

        const executeTurn = () => {
            const selectedEnemyIndex = this.registry.get('enemyIndex');

            switch (currentTurn % 4) {
                case 0:
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

            console.log("Turn mod 4: " + currentTurn);
            currentTurn++;

            if (currentTurn < maxTurns) {
                this.time.delayedCall(2000, executeTurn, [], this);
            } else {
                this.lockUi = false;
            }
        };

        executeTurn();
    }

    playerAttack(enemyIndex) {
        const selectedEnemy = this.selectedEnemy;

        if (selectedEnemy && !selectedEnemy.defeated) {
            const damage = Phaser.Math.Between(1, 10);
            selectedEnemy.health -= damage;
            console.log(`Player dealt: ${damage} to enemy ${enemyIndex + 1} - HP: ${selectedEnemy.health}`);
            const enemyButton = this.battleMenuContainer.getAt(enemyIndex + 5);
            if (enemyButton) {
                enemyButton.setText(`Enemy ${enemyIndex + 1} - HP: ${selectedEnemy.health}`);
                if (selectedEnemy.health <= 0) {
                    selectedEnemy.defeated = true;
                    this.defeatedEnemies++;
                    console.log(`Enemy ${enemyIndex + 1} defeated!`);

                    if (this.defeatedEnemies === this.enemyGroup.getChildren().length) {
                        console.log('All enemies defeated! Transitioning to winScene');
                        this.scene.start('winScene');
                    }
                }
            }
        }
    }

    enemyAttack(enemyIndex) {
        const damage = Phaser.Math.Between(1, 10);
        console.log(`Initial player health: ${this.playerHealth}`);
        this.playerHealth -= damage;
        console.log(`Enemy dealt: ${damage} to the player- Player HP: ${this.playerHealth}`);
        const playerHealthText = this.battleMenuContainer.getAt(4);
        if (playerHealthText) {
            playerHealthText.setText(`Player Health: ${this.playerHealth}`);
        }
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

        const playerHealthText = this.add.text(300, 50, `Player Health: ${this.playerHealth}`, {
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontSize: '20px',
        });

        playerHealthText.setOrigin(0, 0);
        this.battleMenuContainer.add(playerHealthText);
    }

    displaySplashText(text) {
        this.clearMessages();

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.splashText.setText(text);
        this.splashText.setPosition(centerX, centerY);
        this.splashText.setVisible(true);

        setTimeout(() => {
            this.clearMessages();
        }, 2000);
    }

    clearMessages() {
        this.splashText.setVisible(false);
    }

    playerHeal() {
        this.playerHealth += 10;
        const playerHealthText = this.battleMenuContainer.getAt(4);
        if (playerHealthText) {
            playerHealthText.setText(`Player Health: ${this.playerHealth}`);
        }
    }

    handleButtonClick(buttonText) {
        if (this.lockUi) {
            this.displaySplashText('Currently cannot interact!');
            return;
        }

        const selectedEnemyIndex = this.registry.get('enemyIndex');

        switch (buttonText) {
            case 'Attack':
                if (selectedEnemyIndex > -1 && selectedEnemyIndex < 3 && this.selectedEnemy && !this.selectedEnemy.defeated) {
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
