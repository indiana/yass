import Phaser from 'phaser';
export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    create() {
        const { width, height } = this.cameras.main;
        const score = this.scene.get('Play').score || 0;
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.bitmapText(width / 2 - 120, 100, 'modern_led', 'Game Over!', 36);
        this.add.text(width / 2, 170, 'Your score: ' + score, {
            font: '18px Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(width / 2, 450, 'Press ENTER or click to play again', {
            font: '16px Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('Play'));
        this.input.on('pointerdown', () => this.scene.start('Play'));
    }
}
//# sourceMappingURL=GameOver.js.map