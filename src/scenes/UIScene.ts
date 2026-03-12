import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
    private scoreText!: Phaser.GameObjects.BitmapText;
    private healthText!: Phaser.GameObjects.BitmapText;
    private weaponModeText!: Phaser.GameObjects.BitmapText;
    private fpsText!: Phaser.GameObjects.Text;
    private soundIcon!: Phaser.GameObjects.Sprite;

    constructor() {
        super('UIScene');
    }

    create() {
        const { width } = this.cameras.main;

        this.scoreText = this.add.bitmapText(10, 10, 'modern_led', 'SCORE: 0', 12);
        this.healthText = this.add.bitmapText(200, 10, 'modern_led', 'HP: 10', 12);
        this.weaponModeText = this.add.bitmapText(500, 10, 'modern_led', 'WEAPON: Single', 12);
        this.fpsText = this.add.text(5, 580, '', { font: '16px Arial', color: '#ffffff' });

        const playSound = this.registry.get('playSound') !== false;
        this.soundIcon = this.add.sprite(width - 32, 20, playSound ? 'soundOn' : 'soundOff').setInteractive();
        
        this.soundIcon.on('pointerdown', () => {
            const current = this.registry.get('playSound') !== false;
            this.registry.set('playSound', !current);
        });

        // Listen for changes in registry
        this.registry.events.on('changedata', this.updateUI, this);
        
        // Cleanup when scene is stopped or destroyed
        this.events.once('shutdown', () => {
            this.registry.events.off('changedata', this.updateUI, this);
        });

        // Initial sync
        this.updateUI();
    }

    private updateUI() {
        this.scoreText.setText('SCORE: ' + (this.registry.get('score') || 0));
        this.healthText.setText('HP: ' + Math.max(this.registry.get('health') || 0, 0));
        
        const mode = this.registry.get('weaponMode') || 0;
        const modes = ['Single', 'Double', 'Triple'];
        const shotsFired = this.registry.get('shotsFired') || 0;
        const powerupShots = this.registry.get('powerupShots') || 0;
        const powerupLeft = powerupShots - shotsFired;
        
        this.weaponModeText.setText(`WEAPON: ${modes[mode]}${mode > 0 ? ` (${powerupLeft})` : ''}`);
        
        const playSound = this.registry.get('playSound') !== false;
        this.soundIcon.setTexture(playSound ? 'soundOn' : 'soundOff');
    }

    update() {
        this.fpsText.setText(Math.floor(this.game.loop.actualFps) + ' FPS');
    }
}