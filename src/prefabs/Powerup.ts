import Phaser from 'phaser';

export class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture || 'powerup_hp', frame);
        scene.add.existing(this);
        
        this.setOrigin(0.5, 0.5);
    }

    spawn(x: number, y: number, texture: string) {
        this.setTexture(texture);
        this.enableBody(true, x, y, true, true);
        this.setVelocityY(150);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        if (this.y > 650) {
            this.disableBody(true, true);
        }
    }
}