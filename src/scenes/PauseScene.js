import Phaser from 'phaser';
export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }
    create() {
        const { width, height } = this.cameras.main;
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0, 0);
        this.add.bitmapText(width / 2 - 120, height / 2 - 50, 'modern_led', 'PAUSED', 36);
        this.add.bitmapText(width / 2 - 150, height / 2 + 50, 'modern_led', 'Click anywhere to unpause', 12);
        this.input.on('pointerdown', () => {
            this.scene.resume('Play');
            this.scene.stop();
        });
        const pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        pKey.on('down', () => {
            this.scene.resume('Play');
            this.scene.stop();
        });
    }
}
//# sourceMappingURL=PauseScene.js.map