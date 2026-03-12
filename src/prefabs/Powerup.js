import Phaser from 'phaser';
export class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture || 'powerup_hp', frame);
        scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
    }
    spawn(x, y, texture) {
        this.setTexture(texture);
        this.enableBody(true, x, y, true, true);
        this.setVelocityY(150);
    }
    update() {
        if (this.y > 650) {
            this.disableBody(true, true);
        }
    }
}
//# sourceMappingURL=Powerup.js.map