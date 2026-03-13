import Phaser from 'phaser';

export class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'explosion');
        // Add to scene display list and update list so it renders and updates
        scene.add.existing(this);
        
        this.on('animationcomplete', () => {
            this.setActive(false).setVisible(false);
        });
    }
}
