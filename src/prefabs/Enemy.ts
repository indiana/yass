import Phaser from 'phaser';
import { IMovementStrategy, IShootingStrategy } from '../behaviors/IBehavior';
import { EnemyConfig } from '../configs/EnemyConfig';
import { Play } from '../scenes/Play';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private movementStrategy!: IMovementStrategy;
    private shootingStrategy!: IShootingStrategy;
    public config!: EnemyConfig;

    constructor(scene: Phaser.Scene) {
        // A default texture is required, but it will be overridden by spawn.
        super(scene, 0, 0, 'enemy1');
        scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
    }

    public spawn(config: EnemyConfig) {
        this.config = config;
        this.movementStrategy = config.movement;
        this.shootingStrategy = config.shooting;

        this.setTexture(config.sprite);
        
        const startX = Phaser.Math.Between(24, 776);
        this.enableBody(true, startX, -50, true, true);
        if (this.body) this.body.immovable = true;
        this.setData('health', config.hp);

        const finalYVelocity = (config.baseYVelocity + Phaser.Math.Between(1, 100)) * config.yVelocityMultiplier;
        this.setVelocity(config.initialXVelocity(), finalYVelocity);
        
        const animKey = 'flame' + config.sprite.replace('enemy', '');
        this.play(animKey);
    }

    public damage(amount: number): boolean {
        const newHealth = this.getData('health') - amount;
        this.setData('health', newHealth);
        return newHealth <= 0;
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        
        if (!this.active) return;
        
        // Let strategies handle behavior
        this.movementStrategy.update(this, this.scene as Play);
        this.shootingStrategy.update(this, this.scene as Play, time);

        // Self-destruct if off-screen
        if (this.y > 650) {
            this.disableBody(true, true);
        }
    }
}
