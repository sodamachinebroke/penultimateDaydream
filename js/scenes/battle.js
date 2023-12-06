/// <reference path="../types/index.d.ts" />

class BattleScene extends Phaser.Scene {
    constructor(title) {
        super({ key: title });
    }

    preload() {
        
    }

    create() {
        this.bg = this.add.sprite(0, 0, 'battleBG');
        this.bg.setOrigin(0, 0);


        const bMusic = this.sound.add('battleSong');
        bMusic.setVolume(0.2);
        bMusic.play();


        this.scene.start('battle');
    }

}