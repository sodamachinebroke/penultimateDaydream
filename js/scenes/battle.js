/// <reference path="../types/index.d.ts" />

class battleScene extends Phaser.Scene {
    constructor(title) {
        super(title);
    }

    preload() {
        this.load.image("battleBG", "assets/battleBG.png");
        this.load.audio('battleSong', ['music', 'assets/battleMusic.mp3']);
    }

    create() {

    }

    update() {

    }

}