import Phaser from 'phaser';
import { Bullet } from './Bullet';
import { WeaponMode } from '../utils/GameRegistry';
import { IPlayerMovable, IPlayerInput, IPlayerContext, IPlayerMovementStrategy, IPlayerShootingStrategy } from '../interfaces/IPlayerBehaviors';
import { DefaultPlayerMovement } from '../behaviors/PlayerMovement';
import { DefaultPlayerShooting } from '../behaviors/PlayerShooting';

export class Player extends Phaser.Physics.Arcade.Sprite implements IPlayerMovable {
    private SHOT_DELAY = 100;
    
    private lastBulletShotAt = 0;
    private bulletPool: Phaser.Physics.Arcade.Group;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey: Phaser.Input.Keyboard.Key;

    private movementStrategy: IPlayerMovementStrategy;
    private shootingStrategy: IPlayerShootingStrategy;

    constructor(scene: Phaser.Scene, x: number, y: number, bulletPool: Phaser.Physics.Arcade.Group) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(500, 0); // MAX_SPEED
        this.play('player_flame');
        
        this.bulletPool = bulletPool;
        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.movementStrategy = new DefaultPlayerMovement();
        this.shootingStrategy = new DefaultPlayerShooting();
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        
        const input: IPlayerInput = {
            leftDown: this.cursors.left.isDown,
            rightDown: this.cursors.right.isDown,
            shootDown: this.spaceKey.isDown || this.scene.input.activePointer.isDown
        };

        this.movementStrategy.update(this, input);

        const context: IPlayerContext = {
            weaponMode: this.scene.registry.get('weaponMode') || WeaponMode.SINGLE,
            canShoot: (t) => this.active && t - this.lastBulletShotAt >= this.SHOT_DELAY,
            fireBullet: (x, y, vx, vy) => {
                const bullet = this.bulletPool.get() as Bullet;
                if (bullet) {
                    bullet.fire(x, y, vx, vy);
                }
            },
            onShootSuccess: (t) => {
                this.lastBulletShotAt = t;
                this.scene.registry.set('shotsFired', (this.scene.registry.get('shotsFired') || 0) + 1);
            },
            playSound: (key) => {
                if (this.scene.registry.get('playSound') !== false) {
                    this.scene.sound.play(key);
                }
            }
        };

        this.shootingStrategy.update(this, input, context, time);
    }

    // IPlayerMovable implementation
    getVelocityX(): number {
        return this.body!.velocity.x;
    }

    reset(x: number, y: number) {
        this.enableBody(true, x, y, true, true);
        this.setAlpha(1);
    }
}