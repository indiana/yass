import Phaser from 'phaser';
import { Background } from '../prefabs/Background';
import { Bullet } from '../prefabs/Bullet';
import { Enemy } from '../prefabs/Enemy';
import { Powerup } from '../prefabs/Powerup';
export class Play extends Phaser.Scene {
    MAX_SPEED = 500;
    ACCELERATION = 5000;
    SHOT_DELAY = 100;
    BULLET_SPEED = 500;
    NUMBER_OF_BULLETS = 40;
    NUMBER_OF_ENEMIES = 10;
    NUMBER_OF_EXPLOSIONS = 20;
    NUMBER_OF_POWERUPS = 2;
    WEAPON_POWERUP_LIMIT = 500;
    POWERUP_NAMES = ['powerup_weapon2', 'powerup_hp'];
    player;
    background;
    playerBulletPool;
    enemyBulletPool;
    enemyPool;
    powerupPool;
    explosionPool;
    weaponMode = 0;
    powerupShots = 0;
    shotsFired = 0;
    score = 0;
    enemiesSpawned = 0;
    playSound = 1;
    scoreText;
    healthText;
    weaponModeText;
    fpsText;
    soundIcon;
    lastBulletShotAt = 0;
    lastEnemyBulletShotAt = 0;
    cursors;
    spaceKey;
    sKey;
    pKey;
    constructor() {
        super('Play');
    }
    create() {
        const { width, height } = this.cameras.main;
        // Background
        this.background = new Background(this);
        // Player
        this.player = this.physics.add.sprite(width / 2, 550, 'player');
        this.player.setOrigin(0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setMaxVelocity(this.MAX_SPEED, 0);
        this.player.play('player_flame');
        this.player.setData('health', 10);
        // Pools
        this.playerBulletPool = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            defaultKey: 'projectile'
        });
        this.enemyBulletPool = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            defaultKey: 'projectile2'
        });
        this.enemyPool = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true,
            defaultKey: 'enemy1'
        });
        this.powerupPool = this.physics.add.group({
            classType: Powerup,
            runChildUpdate: true,
            defaultKey: 'powerup_hp'
        });
        this.explosionPool = this.add.group({
            defaultKey: 'explosion',
            maxSize: this.NUMBER_OF_EXPLOSIONS
        });
        // UI
        this.scoreText = this.add.bitmapText(0, 0, 'modern_led', 'SCORE: 0', 12);
        this.healthText = this.add.bitmapText(200, 0, 'modern_led', 'HP: 10', 12);
        this.weaponModeText = this.add.bitmapText(500, 0, 'modern_led', 'WEAPON: Single', 12);
        this.fpsText = this.add.text(5, 580, '', { font: '16px Arial', color: '#ffffff' });
        // Sound settings
        const storedSound = localStorage.getItem('playSound');
        this.playSound = storedSound !== null ? parseInt(storedSound) : 1;
        this.soundIcon = this.add.sprite(width - 32, 16, this.playSound === 1 ? 'soundOn' : 'soundOff').setInteractive();
        this.soundIcon.on('pointerdown', () => this.toggleSound());
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        // Collisions
        this.physics.add.overlap(this.playerBulletPool, this.enemyPool, this.enemyHit, undefined, this);
        this.physics.add.overlap(this.enemyBulletPool, this.player, this.playerHit, undefined, this);
        this.physics.add.overlap(this.enemyPool, this.player, this.playerRammed, undefined, this);
        this.physics.add.overlap(this.powerupPool, this.player, this.collectPowerup, undefined, this);
        this.spawnEnemy();
    }
    update(time) {
        this.player.setY(500);
        this.background.update();
        // Input handling
        if (Phaser.Input.Keyboard.JustDown(this.sKey)) {
            this.toggleSound();
        }
        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.pauseGame();
        }
        if (this.cursors.left.isDown) {
            this.player.setAccelerationX(-this.ACCELERATION);
        }
        else if (this.cursors.right.isDown) {
            this.player.setAccelerationX(this.ACCELERATION);
        }
        else {
            this.player.setAccelerationX(0);
            const velocityX = this.player.body.velocity.x;
            if (Math.abs(velocityX) < 50) {
                this.player.setVelocityX(0);
            }
            else {
                this.player.setVelocityX(velocityX > 0 ? velocityX - 50 : velocityX + 50);
            }
        }
        if (this.spaceKey.isDown || this.input.activePointer.isDown) {
            this.playerShoot(time);
        }
        // Enemy shooting and logic
        this.enemyPool.getChildren().forEach((gameObject) => {
            const enemy = gameObject;
            if (enemy.active) {
                if (Phaser.Math.Between(1, 500 - Math.min(this.score, 400)) <= 10) {
                    this.enemyShoot(enemy, time);
                }
                if (this.enemiesSpawned > 50 && Phaser.Math.Between(1, 1000) === 1) {
                    const velocityX = this.player.x > enemy.x ? Phaser.Math.Between(0, 200) : -Phaser.Math.Between(0, 200);
                    enemy.setVelocityX(velocityX);
                }
            }
        });
        // Spawn logic
        if (Phaser.Math.Between(1, 500 - Math.min(this.enemiesSpawned, 400)) <= 10) {
            this.spawnEnemy();
        }
        // UI Updates
        this.fpsText.setText(Math.floor(this.game.loop.actualFps) + ' FPS');
        this.scoreText.setText('SCORE: ' + this.score);
        this.healthText.setText('HP: ' + Math.max(this.player.getData('health'), 0));
        // Weapon mode logic
        if (this.weaponMode > 0 && this.powerupShots <= this.shotsFired) {
            this.weaponMode--;
            this.powerupShots = this.shotsFired + this.WEAPON_POWERUP_LIMIT;
        }
        const powerupLeft = this.powerupShots - this.shotsFired;
        const modes = ['Single', 'Double', 'Triple'];
        this.weaponModeText.setText(`WEAPON: ${modes[this.weaponMode]}${this.weaponMode > 0 ? ` (${powerupLeft})` : ''}`);
    }
    playerShoot(time) {
        if (!this.player.active || time - this.lastBulletShotAt < this.SHOT_DELAY)
            return;
        this.lastBulletShotAt = time;
        const bulletCount = this.weaponMode + 1;
        for (let i = 0; i < bulletCount; i++) {
            const bullet = this.playerBulletPool.get();
            if (bullet) {
                let offsetX = 0;
                let velocityX = 0;
                if (this.weaponMode === 1) {
                    offsetX = i === 0 ? -20 : 20;
                }
                else if (this.weaponMode === 2) {
                    if (i === 1) {
                        offsetX = -20;
                        velocityX = -50;
                    }
                    else if (i === 2) {
                        offsetX = 20;
                        velocityX = 50;
                    }
                }
                bullet.fire(this.player.x + offsetX, this.player.y - 10, velocityX, -this.BULLET_SPEED);
                this.shotsFired++;
            }
        }
        if (this.playSound === 1)
            this.sound.play('player_shot');
    }
    enemyShoot(enemy, time) {
        if (enemy.texture.key === 'enemy3' || time - this.lastEnemyBulletShotAt < this.SHOT_DELAY * 2)
            return;
        this.lastEnemyBulletShotAt = time;
        const bullet = this.enemyBulletPool.get();
        if (bullet) {
            const velocityY = Math.min(200 + Math.floor(this.enemiesSpawned / 50) * 50, 700);
            bullet.fire(enemy.x, enemy.y + 32, 0, velocityY);
            const damageMap = { 'enemy1': 4, 'enemy2': 5, 'enemy4': 2 };
            bullet.setData('damage', damageMap[enemy.texture.key] || 1);
            if (this.playSound === 1)
                this.sound.play('enemy_shot');
        }
    }
    enemyHit(bullet, enemy) {
        bullet.disableBody(true, true);
        if (enemy.damage(5)) {
            this.enemyDown(enemy);
        }
    }
    enemyDown(enemy) {
        enemy.disableBody(true, true);
        this.explode(enemy);
        const scoreMap = { 'enemy1': 2, 'enemy2': 3, 'enemy3': 4, 'enemy4': 1 };
        this.score += scoreMap[enemy.texture.key] || 0;
        if (Phaser.Math.Between(1, 100) <= 4) {
            this.genPowerup(enemy.x, enemy.y);
        }
    }
    playerHit(player, bullet) {
        const damage = bullet.getData('damage') || 1;
        bullet.disableBody(true, true);
        const newHealth = player.getData('health') - damage;
        player.setData('health', newHealth);
        if (newHealth <= 0) {
            this.playerDown();
        }
        else {
            this.tweens.add({
                targets: player,
                alpha: 0.1,
                duration: 100,
                yoyo: true,
                repeat: 5
            });
        }
    }
    playerRammed(player, enemy) {
        this.enemyDown(enemy);
        this.playerDown();
    }
    playerDown() {
        this.player.setTexture('player_explode');
        this.player.disableBody(true, false);
        this.explode(this.player);
        this.time.delayedCall(1000, () => this.scene.start('GameOver'));
    }
    spawnEnemy() {
        const enemy = this.enemyPool.get();
        if (!enemy)
            return;
        let type = 'enemy1';
        let hp = 10;
        const rand = Phaser.Math.Between(1, 10);
        const levelBonus = Math.min(Math.floor(this.enemiesSpawned / 100), 5);
        if (rand <= 1 + levelBonus) {
            type = 'enemy2';
            hp = 15;
        }
        else if (rand <= 1 + levelBonus) { // Original logic had a potential bug here but I'll keep it similar
            type = 'enemy3';
            hp = 15;
        }
        else if (rand <= 5) {
            type = 'enemy4';
            hp = 1;
        }
        enemy.spawn(hp, type);
        this.enemiesSpawned++;
    }
    explode(sprite) {
        const explosion = this.explosionPool.get(sprite.x, sprite.y);
        if (explosion) {
            explosion.setActive(true).setVisible(true);
            explosion.play('explode');
            if (this.playSound === 1)
                this.sound.play('enemy_explode');
        }
    }
    genPowerup(x, y) {
        const powerup = this.powerupPool.get();
        if (!powerup)
            return;
        const isWeapon = Phaser.Math.Between(0, 1) === 0;
        const texture = isWeapon ? (this.weaponMode === 0 ? 'powerup_weapon2' : 'powerup_weapon3') : 'powerup_hp';
        powerup.spawn(x, y, texture);
    }
    collectPowerup(player, powerup) {
        const key = powerup.texture.key;
        powerup.disableBody(true, true);
        if (key.includes('weapon')) {
            if (this.powerupShots < this.shotsFired)
                this.powerupShots = this.shotsFired;
            if (this.weaponMode < 2)
                this.weaponMode++;
            this.powerupShots += this.WEAPON_POWERUP_LIMIT;
            if (this.playSound === 1)
                this.sound.play('powerup');
        }
        else if (key === 'powerup_hp') {
            player.setData('health', Math.min(10, player.getData('health') + 5));
        }
    }
    toggleSound() {
        this.playSound = this.playSound === 1 ? 0 : 1;
        this.soundIcon.setTexture(this.playSound === 1 ? 'soundOn' : 'soundOff');
        localStorage.setItem('playSound', this.playSound.toString());
    }
    pauseGame() {
        this.scene.pause();
        this.scene.launch('PauseScene'); // We should create a simple pause scene
    }
}
//# sourceMappingURL=Play.js.map