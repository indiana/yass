import Phaser from 'phaser';
import { Bullet } from './Bullet';
import { WeaponMode } from '../utils/GameRegistry';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private MAX_SPEED = 500;
    private ACCELERATION = 5000;
    private SHOT_DELAY = 100;
    private BULLET_SPEED = 500;
    
    private lastBulletShotAt = 0;
    private bulletPool: Phaser.Physics.Arcade.Group;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number, bulletPool: Phaser.Physics.Arcade.Group) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(this.MAX_SPEED, 0);
        this.play('player_flame');
        
        this.bulletPool = bulletPool;
        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        
        this.handleMovement();
        
        if (this.spaceKey.isDown || this.scene.input.activePointer.isDown) {
            this.shoot(time);
        }
    }

    private handleMovement() {
        if (this.cursors.left.isDown) {
            this.setAccelerationX(-this.ACCELERATION);
        } else if (this.cursors.right.isDown) {
            this.setAccelerationX(this.ACCELERATION);
        } else {
            this.setAccelerationX(0);
            const velocityX = this.body!.velocity.x;
            if (Math.abs(velocityX) < 50) {
                this.setVelocityX(0);
            } else {
                this.setVelocityX(velocityX > 0 ? velocityX - 50 : velocityX + 50);
            }
        }
        
        // Keep at fixed height
        this.setY(500);
    }

    private shoot(time: number) {
        if (!this.active || time - this.lastBulletShotAt < this.SHOT_DELAY) return;
        
        const weaponMode = this.scene.registry.get('weaponMode') || WeaponMode.SINGLE;
        this.lastBulletShotAt = time;
        const bulletCount = weaponMode + 1;
        
        for (let i = 0; i < bulletCount; i++) {
            const bullet = this.bulletPool.get() as Bullet;
            if (bullet) {
                let offsetX = 0;
                let velocityX = 0;
                
                if (weaponMode === WeaponMode.DOUBLE) {
                    offsetX = i === 0 ? -20 : 20;
                } else if (weaponMode === WeaponMode.TRIPLE) {
                    if (i === 1) { offsetX = -20; velocityX = -50; }
                    else if (i === 2) { offsetX = 20; velocityX = 50; }
                }
                
                bullet.fire(this.x + offsetX, this.y - 10, velocityX, -this.BULLET_SPEED);
                this.scene.registry.set('shotsFired', (this.scene.registry.get('shotsFired') || 0) + 1);
            }
        }

        if (this.scene.registry.get('playSound') !== false) {
            this.scene.sound.play('player_shot');
        }
    }

    reset(x: number, y: number) {
        this.enableBody(true, x, y, true, true);
        this.setAlpha(1);
    }
}