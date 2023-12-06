/// <reference path="../types/index.d.ts" />

class BattleScene extends Phaser.Scene {
    constructor(title) {
        super({ key: title });
    }

    preload() {
        
    }

    create() {
        this.initializeBasics();
    }

    initializeBasics(){
        this.cameras.main.fadeIn(1000);
        this.bg = this.add.sprite(0, 0, 'battleBG');
        this.bg.setOrigin(0, 0);
        this.bg.setDisplaySize(800, 640);

        const bMusic = this.sound.add('battleSong');
        bMusic.setVolume(0);

        this.tweens.add({
            targets: bMusic,
            volume: 0.2,
            duration: 5000,
            ease: 'Linear'
        });
        bMusic.play();
    }

}