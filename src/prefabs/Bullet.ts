import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture || 'projectile', frame);
        scene.add.existing(this);
        // physics body will be added by the group
        
        this.setOrigin(0.5, 0.5);
    }

    fire(x: number, y: number, velocityX: number, velocityY: number) {
        this.enableBody(true, x, y, true, true);
        this.setVelocity(velocityX, velocityY);
    }

    update() {
        if (this.y < -50 || this.y > 650 || this.x < -50 || this.x > 850) {
            this.disableBody(true, true);
        }
    }
}