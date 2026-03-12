import Phaser from 'phaser';
export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }
    create() {
        const { width, height } = this.cameras.main;
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        const player = this.add.sprite(width / 2, 138, 'player').setOrigin(0.5);
        this.add.bitmapText(width / 2 - 180, height / 2 - 70, 'modern_led', 'Yet Another', 36);
        this.add.bitmapText(width / 2 - 220, height / 2, 'modern_led', 'Space Shooter', 36);
        const instructions = [
            'Press SPACE or ENTER or click anywhere to play',
            'Use left and right arrow to move, space to shoot',
            'P - Pause, S - Sound on/off'
        ];
        instructions.forEach((text, index) => {
            this.add.text(width / 2, height - 80 + (index * 30), text, {
                font: '16px Arial',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
        });
        player.setAngle(-20);
        this.tweens.add({
            targets: player,
            angle: 20,
            duration: 1000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
        this.input.keyboard.on('keydown-SPACE', () => this.scene.start('Play'));
        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('Play'));
        this.input.on('pointerdown', () => this.scene.start('Play'));
    }
}
//# sourceMappingURL=Menu.js.map