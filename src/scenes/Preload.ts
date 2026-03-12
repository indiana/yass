import Phaser from 'phaser';

export class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;


        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('Menu');
        });

        // Assets from legacy/game/states/preload.js
        this.load.spritesheet('player', 'starship3.png', { frameWidth: 51, frameHeight: 51 });
        this.load.spritesheet('player_explode', 'player_explode.png', { frameWidth: 51, frameHeight: 51 });
        this.load.image('projectile', 'projectile.png');
        this.load.image('projectile2', 'projectile2.png');
        this.load.spritesheet('enemy1', 'enemy_02.png', { frameWidth: 51, frameHeight: 51 });
        this.load.spritesheet('enemy2', 'enemy_03.png', { frameWidth: 51, frameHeight: 51 });
        this.load.spritesheet('enemy3', 'enemy_05.png', { frameWidth: 39, frameHeight: 51 });
        this.load.spritesheet('enemy4', 'enemy_01.png', { frameWidth: 51, frameHeight: 51 });
        this.load.image('powerup_weapon2', 'powerup_weapon2.png');
        this.load.image('powerup_weapon3', 'powerup_weapon3.png');
        this.load.image('powerup_hp', 'powerup_hp.png');
        this.load.image('bg100', 'Parallax100.png');
        this.load.image('bg80', 'Parallax80.png');
        this.load.image('bg60', 'Parallax60.png');
        this.load.image('background', 'background.jpg');
        this.load.image('soundOn', 'sound_on.png');
        this.load.image('soundOff', 'sound_off.png');

        this.load.bitmapFont('modern_led', 'Modern LED Board 7/font.png', 'Modern LED Board 7/font.fnt');

        this.load.audio('player_shot', 'player_shot.wav');
        this.load.audio('enemy_shot', 'enemy_shot.wav');
        this.load.audio('enemy_explode', 'enemy_explode.wav');
        this.load.audio('powerup', 'powerup.wav');

        this.load.spritesheet('explosion', 'explosion3.png', { frameWidth: 64, frameHeight: 64 });

        this.load.on('complete', () => {
            this.createAnimations();
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('Menu');
        });
    }

    private createAnimations() {
        // Player animation
        this.anims.create({
            key: 'player_flame',
            frames: this.anims.generateFrameNumbers('player', {}),
            frameRate: 12,
            repeat: -1
        });

        // Explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {}),
            frameRate: 20,
            hideOnComplete: true
        });

        // Enemy animations
        ['1', '2', '3', '4'].forEach(num => {
            this.anims.create({
                key: 'flame' + num,
                frames: this.anims.generateFrameNumbers('enemy' + num, {}),
                frameRate: 12,
                repeat: -1
            });
        });
    }
}