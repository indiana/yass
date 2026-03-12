import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture || 'enemy1', frame);
        scene.add.existing(this);
        
        this.setOrigin(0.5, 0.5);
    }

    spawn(hp: number, texture: string) {
        this.setTexture(texture);
        
        let startX: number;
        if (texture === 'enemy4') {
            startX = Phaser.Math.Between(24, 576);
        } else {
            startX = Phaser.Math.Between(24, 776);
        }

        this.enableBody(true, startX, -50, true, true);
        if (this.body) this.body.immovable = true;
        this.setData('health', hp);

        let velocityY = 150 + Phaser.Math.Between(1, 100);
        if (texture === 'enemy3') {
            velocityY += 100;
        }
        this.setVelocityY(velocityY);

        let velocityX = 0;
        if (texture === 'enemy2') {
            velocityX = -50 + Phaser.Math.Between(0, 100);
        } else if (texture !== 'enemy4') {
            velocityX = -5 + Phaser.Math.Between(0, 10);
        }
        this.setVelocityX(velocityX);

        // Animations
        const animKey = 'flame' + texture.replace('enemy', '');
        this.play(animKey);
    }

    damage(amount: number) {
        let hp = this.getData('health') - amount;
        this.setData('health', hp);
        if (hp <= 0) {
            return true; // killed
        }
        return false;
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        if (this.texture.key === 'enemy4' && this.active) {
            this.setVelocityX(200 * Math.sin(this.y * Math.PI / 300));
        }

        if (this.y > 650) {
            this.disableBody(true, true);
        }
    }
}