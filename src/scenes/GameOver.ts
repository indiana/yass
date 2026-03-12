import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const { width } = this.cameras.main;
        const score = this.registry.get('score') || 0;

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.bitmapText(width / 2, 100, 'modern_led', 'Game Over!', 36).setOrigin(0.5);

        this.add.text(width / 2, 170, 'Your score: ' + score, {
            font: '18px Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        const prompt = this.add.text(width / 2, 450, 'Press ENTER or click to play again', {
            font: '16px Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Flash the prompt
        this.tweens.add({
            targets: prompt,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        const restart = () => {
            // Stop this scene and start Play
            this.scene.start('Play');
        };

        // Add a 500ms delay before accepting input to prevent accidental restarts
        this.time.delayedCall(500, () => {
            this.input.keyboard!.once('keydown-ENTER', restart);
            this.input.once('pointerdown', restart);
        });
    }
}