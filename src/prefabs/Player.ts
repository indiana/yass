import Phaser from 'phaser';
import { Bullet } from './Bullet';
import { WeaponMode } from '../utils/GameRegistry';
import { IPlayerMovable, IPlayerInput, IPlayerContext, IPlayerMovementStrategy, IPlayerShootingStrategy } from '../interfaces/IPlayerBehaviors';
import { DefaultPlayerMovement } from '../behaviors/PlayerMovement';
import { DefaultPlayerShooting } from '../behaviors/PlayerShooting';
import { Play } from '../scenes/Play';
import { IProjectileManager } from '../interfaces/IGameEntities';

export class Player extends Phaser.Physics.Arcade.Sprite implements IPlayerMovable {
    private SHOT_DELAY = 100;
    
    private lastBulletShotAt = 0;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey: Phaser.Input.Keyboard.Key;

    private movementStrategy: IPlayerMovementStrategy;
    private shootingStrategy: IPlayerShootingStrategy;
    private projectileManager: IProjectileManager;

    constructor(scene: Play, x: number, y: number, projectileManager: IProjectileManager) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(500, 0); // MAX_SPEED
        this.play('player_flame');
        
        this.projectileManager = projectileManager;
        this.cursors = scene.input.keyboard!.createCursorKeys();
        this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.movementStrategy = new DefaultPlayerMovement();
        this.shootingStrategy = new DefaultPlayerShooting();
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        
        const playScene = this.scene as Play;
        const input: IPlayerInput = {
            leftDown: this.cursors.left.isDown,
            rightDown: this.cursors.right.isDown,
            shootDown: this.spaceKey.isDown || this.scene.input.activePointer.isDown
        };

        this.movementStrategy.update(this, input);

        const context: IPlayerContext = {
            weaponMode: playScene.registryHelper.weaponMode,
            canShoot: (t) => this.active && t - this.lastBulletShotAt >= this.SHOT_DELAY,
            projectileManager: this.projectileManager,
            onShootSuccess: (t) => {
                this.lastBulletShotAt = t;
                playScene.registryHelper.incrementShotsFired();
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