import Phaser from 'phaser';
import { Background } from '../prefabs/Background';
import { Bullet } from '../prefabs/Bullet';
import { Enemy } from '../prefabs/Enemy';
import { Powerup } from '../prefabs/Powerup';
import { Player } from '../prefabs/Player';
import { GameRegistry, WeaponMode } from '../utils/GameRegistry';
import { EnemyTypes } from '../configs/EnemyConfig';

export class Play extends Phaser.Scene {
    private SHOT_DELAY = 100;
    private NUMBER_OF_EXPLOSIONS = 20;
    private WEAPON_POWERUP_LIMIT = 500;

    public player!: Player; // Public for strategies
    private background!: Background;
    private playerBulletPool!: Phaser.Physics.Arcade.Group;
    private enemyBulletPool!: Phaser.Physics.Arcade.Group;
    private enemyPool!: Phaser.Physics.Arcade.Group;
    private powerupPool!: Phaser.Physics.Arcade.Group;
    private explosionPool!: Phaser.GameObjects.Group;

    public registryHelper!: GameRegistry; // Public for strategies
    private lastEnemyBulletShotAt = 0;
    private sKey!: Phaser.Input.Keyboard.Key;
    private pKey!: Phaser.Input.Keyboard.Key;

    private enemyTypes = Object.values(EnemyTypes);

    constructor() {
        super('Play');
    }

    create() {
        const { width } = this.cameras.main;
        this.registryHelper = new GameRegistry(this);
        this.registryHelper.reset();

        this.background = new Background(this);

        this.playerBulletPool = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBulletPool = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyPool = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.powerupPool = this.physics.add.group({ classType: Powerup, runChildUpdate: true });
        this.explosionPool = this.add.group({ defaultKey: 'explosion', maxSize: this.NUMBER_OF_EXPLOSIONS });

        this.player = new Player(this, width / 2, 550, this.playerBulletPool);
        
        this.scene.launch('UIScene');

        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.pKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.physics.add.overlap(this.playerBulletPool, this.enemyPool, this.enemyHit, undefined, this);
        this.physics.add.overlap(this.enemyBulletPool, this.player, this.playerHit, undefined, this);
        this.physics.add.overlap(this.enemyPool, this.player, this.playerRammed, undefined, this);
        this.physics.add.overlap(this.powerupPool, this.player, this.collectPowerup, undefined, this);

        this.spawnEnemy();
    }

    update(time: number) {
        if (Phaser.Input.Keyboard.JustDown(this.sKey)) this.registryHelper.playSound = !this.registryHelper.playSound;
        if (Phaser.Input.Keyboard.JustDown(this.pKey)) this.pauseGame();

        // Spawn logic
        if (Phaser.Math.Between(1, 500 - Math.min(this.registryHelper.enemiesSpawned, 400)) <= 10) {
            this.spawnEnemy();
        }

        // Weapon mode degradation
        if (this.registryHelper.weaponMode > WeaponMode.SINGLE && this.registryHelper.powerupShots <= this.registryHelper.shotsFired) {
            this.registryHelper.weaponMode--;
            this.registryHelper.powerupShots = this.registryHelper.shotsFired + this.WEAPON_POWERUP_LIMIT;
        }
    }

    public enemyShoot(enemy: Enemy, time: number) {
        if (time - this.lastEnemyBulletShotAt < this.SHOT_DELAY * 2) return;
        
        this.lastEnemyBulletShotAt = time;
        const bullet = this.enemyBulletPool.get() as Bullet;
        if (bullet) {
            const velocityY = Math.min(400 + Math.floor(this.registryHelper.enemiesSpawned / 50) * 50, 800);
            bullet.fire(enemy.x, enemy.y + 32, 0, velocityY);
            bullet.setData('damage', enemy.config.bullet?.damage || 1);
            if (this.registryHelper.playSound) this.sound.play('enemy_shot');
        }
    }

    private enemyHit(bullet: Bullet, enemy: Enemy) {
        bullet.disableBody(true, true);
        if (enemy.damage(5)) {
            this.enemyDown(enemy);
        }
    }

    private enemyDown(enemy: Enemy) {
        enemy.disableBody(true, true);
        this.explode(enemy);
        this.registryHelper.score += enemy.config.score;
        if (Phaser.Math.Between(1, 100) <= 4) this.genPowerup(enemy.x, enemy.y);
    }

    private playerHit(player: Player, bullet: Bullet) {
        this.registryHelper.health -= bullet.getData('damage') || 1;
        bullet.disableBody(true, true);
        if (this.registryHelper.health <= 0) this.playerDown();
        else this.tweens.add({ targets: player, alpha: 0.1, duration: 100, yoyo: true, repeat: 5 });
    }

    private playerRammed(player: Player, enemy: Enemy) {
        this.enemyDown(enemy);
        this.playerDown();
    }

    private playerDown() {
        this.player.disableBody(true, true);
        this.explode(this.player);
        this.scene.stop('UIScene');
        if (this.scene.isActive('PauseScene')) this.scene.stop('PauseScene');
        this.time.delayedCall(1000, () => this.scene.start('GameOver'));
    }

    private spawnEnemy() {
        const enemy = this.enemyPool.get() as Enemy;
        if (!enemy) return;

        // Choose a random enemy type based on game progress
        const levelBonus = Math.min(Math.floor(this.registryHelper.enemiesSpawned / 100), 5);
        const rand = Phaser.Math.Between(1, 10);
        let typeKey: string;

        if (rand <= 1 + levelBonus) typeKey = 'heavyGrunt';
        else if (rand <= 2 + levelBonus) typeKey = 'kamikaze';
        else if (rand <= 5) typeKey = 'scout';
        else typeKey = 'grunt';
        
        enemy.spawn(EnemyTypes[typeKey]);
        this.registryHelper.enemiesSpawned++;
    }

    private explode(sprite: Phaser.GameObjects.Sprite) {
        const explosion = this.explosionPool.get(sprite.x, sprite.y);
        if (explosion) {
            explosion.setActive(true).setVisible(true);
            explosion.play('explode');
            if (this.registryHelper.playSound) this.sound.play('enemy_explode');
        }
    }

    private genPowerup(x: number, y: number) {
        const powerup = this.powerupPool.get() as Powerup;
        if (!powerup) return;
        const isWeapon = Phaser.Math.Between(0, 1) === 0;
        const currentMode = this.registryHelper.weaponMode;
        const texture = isWeapon ? (currentMode === WeaponMode.SINGLE ? 'powerup_weapon2' : 'powerup_weapon3') : 'powerup_hp';
        powerup.spawn(x, y, texture);
    }

    private collectPowerup(player: Player, powerup: Powerup) {
        const key = powerup.texture.key;
        powerup.disableBody(true, true);
        if (key.includes('weapon')) {
            if (this.registryHelper.powerupShots < this.registryHelper.shotsFired) this.registryHelper.powerupShots = this.registryHelper.shotsFired;
            if (this.registryHelper.weaponMode < WeaponMode.TRIPLE) this.registryHelper.weaponMode++;
            this.registryHelper.powerupShots += this.WEAPON_POWERUP_LIMIT;
            if (this.registryHelper.playSound) this.sound.play('powerup');
        } else if (key === 'powerup_hp') {
            this.registryHelper.health = Math.min(10, this.registryHelper.health + 5);
        }
    }

    private pauseGame() {
        this.scene.pause();
        this.scene.launch('PauseScene');
    }
}
