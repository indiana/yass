import Phaser from 'phaser';
export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture || 'projectile', frame);
        scene.add.existing(this);
        // physics body will be added by the group
        this.setOrigin(0.5, 0.5);
    }
    fire(x, y, velocityX, velocityY) {
        this.enableBody(true, x, y, true, true);
        this.setVelocity(velocityX, velocityY);
    }
    update() {
        if (this.y < -50 || this.y > 650 || this.x < -50 || this.x > 850) {
            this.disableBody(true, true);
        }
    }
}
//# sourceMappingURL=Bullet.js.map