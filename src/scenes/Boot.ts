import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('preloader', 'preloader.gif');
        this.load.image('splash', 'splash_1.png');
    }

    create() {
        this.scene.start('Preload');
    }
}