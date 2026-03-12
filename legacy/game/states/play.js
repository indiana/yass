'use strict';
var Background = require('../prefabs/background');
var Enemy = require('../prefabs/enemy');
var Bullet = require('../prefabs/bullet');
var Powerup = require('../prefabs/powerup');
function Play() {
}
Play.prototype = {
    create: function() {
        // Setup world
        this.MAX_SPEED = 500;
        this.ACCELERATION = 5000;
        this.SHOT_DELAY = 100; // milliseconds (10 bullets/second)
        this.BULLET_SPEED = 500; // pixels/second
        this.NUMBER_OF_BULLETS = 40;
        this.NUMBER_OF_ENEMIES = 10;
        this.NUMBER_OF_EXPLOSIONS = 20;
        this.NUMBER_OF_POWERUPS = 2;
        this.WEAPON_POWERUP_LIMIT = 500;
        this.POWERUP_NAMES = ['powerup_weapon2', 'powerup_hp'];
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Setup background
        this.background = new Background(this.game, null);
        this.game.add.existing(this.background);

        // Setup sounds
        this.playerShotSound = this.game.add.audio('player_shot');
        this.enemyShotSound = this.game.add.audio('enemy_shot');
        this.explodeSound = this.game.add.audio('enemy_explode');
        this.powerupSound = this.game.add.audio('powerup');

        // Setup player
        this.player = this.game.add.sprite(this.game.width / 2, 550, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.animations.add('flame');
        this.player.animations.play('flame', 12, true);
        this.player.inputEnabled = true;
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.setTo(this.MAX_SPEED, 0);
        this.player.body.immovable = false;

        // Setup weapon
        this.game.weaponMode = 0; // 0 - single bullet, 1 - double bullet, 2 - triple bullet
        this.powerupShots = 0;
        this.weaponModeText = this.game.add.bitmapText(500, 0, 'modern_led', 'WEAPON: Single', 12);

        // Setup player bullets
        this.playerBulletPool = this.game.add.group();
        for (var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
            var bullet = new Bullet(this.game, 'projectile');
            this.game.add.existing(bullet);
            this.playerBulletPool.add(bullet);
        }
        this.shotsFired = 0;

        // Setup powerups
        this.powerupPool = this.game.add.group();
        for (var i = 0; i < this.NUMBER_OF_POWERUPS; i++) {
            var powerup = new Powerup(this.game, 0, 0, this.POWERUP_NAMES[i]);
            this.game.add.existing(powerup);
            this.powerupPool.add(powerup);
        }

        // Setup enemy bullets
        this.enemyBulletPool = this.game.add.group();
        this.enemyBulletPool.enableBody = true;
        for (var i = 0; i < this.NUMBER_OF_ENEMIES / 2; i++) {
            var bullet = new Bullet(this.game, 'projectile2');
            this.game.add.existing(bullet);
            this.enemyBulletPool.add(bullet);
        }

        // Setup enemies
        this.game.enemiesSpawned = 0;
        this.enemyPool = this.game.add.group();
        for (var i = 0; i < this.NUMBER_OF_ENEMIES; i++) {
            var enemy = new Enemy(this.game, 'enemy1');
            this.game.add.existing(enemy);
            this.enemyPool.add(enemy);
        }
        this.spawnEnemy();

        //Setup explosions
        this.explosionPool = this.game.add.group();
        for (var i = 0; i < this.NUMBER_OF_EXPLOSIONS; i++) {
            var explosion = this.game.add.sprite(0, 0, 'explosion');
            this.explosionPool.add(explosion);
            explosion.anchor.setTo(0.5, 0.5);
            explosion.animations.add('explode');
            explosion.animations.getAnimation('explode').killOnComplete = true;
            explosion.kill();
        }

        // Setup input
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.P,
            Phaser.Keyboard.S
        ]);

        // Setup FPS display
        this.game.time.advancedTiming = true;
        this.fpsText = this.game.add.text(
                5, 580, '', {font: '16px Arial', fill: '#ffffff'}
        );

        // Setup score
        this.game.score = 0;
        this.scoreText = this.game.add.bitmapText(0, 0, 'modern_led', 'SCORE: ' + this.game.score, 12);

        // Setup player health
        this.player.health = 10;
        this.healthText = this.game.add.bitmapText(200, 0, 'modern_led', 'HP: ' + this.player.health, 12);

        // Sound on/off
        this.playSound = 1;
        if (!!localStorage) {
            var sound = localStorage.getItem('playSound');
            if (sound != null)
                this.playSound = sound;
        }
        if (this.playSound == 1)
            this.soundIcon = this.game.add.sprite(this.game.width - 32, 0, 'soundOn');
        else
            this.soundIcon = this.game.add.sprite(this.game.width - 32, 0, 'soundOff');

        this.soundIcon.inputEnabled = true;
        this.soundIcon.useHandCursor = true;
        this.soundIcon.events.onInputDown.add(this.soundOnOff, this);
    },
    update: function() {
        this.player.body.y = 500;
        // Process player controls
        if (this.input.keyboard.justPressed(Phaser.Keyboard.S)) {
            this.soundOnOff();
        } else if (this.input.keyboard.justPressed(Phaser.Keyboard.P)) {
            this.game.input.onDown.addOnce(function() {
                this.game.paused = false;
                this.pauseText2.destroy();
                this.game.add.tween(this.pauseText).to({y: -70}, 200, Phaser.Easing.Linear.None, true, 0, 0, false).onComplete.addOnce(
                        function() {
                            this.pauseText = null;
                        }, this, 0
                        );
            }, this);
            if (this.pauseText == null) {
                this.pauseText = this.game.add.bitmapText(this.game.width / 2 - 120, this.game.height / 2 - 50, 'modern_led', 'PAUSED', 36);
                this.pauseText2 = this.game.add.bitmapText(this.game.width / 2 - 150, this.game.height / 2 + 50, 'modern_led', 'Click anywhere to unpause', 12);
                this.game.paused = true;
            }
        } else if (this.leftInputIsActive()) {
            this.player.body.acceleration.x = -this.ACCELERATION;
        } else if (this.rightInputIsActive()) {
            this.player.body.acceleration.x = this.ACCELERATION;
        } else {
            this.player.body.acceleration.x = 0;
            if (Math.abs(this.player.body.velocity.x) < 50)
                this.player.body.velocity.x = 0;
            if (this.player.body.velocity.x > 0)
                this.player.body.velocity.x -= 50;
            else if (this.player.body.velocity.x < 0)
                this.player.body.velocity.x += 50;
        }
        if (this.fireInputIsActive()) {
            this.playerShoot();
        }

        // Collision and other stuff on each enemy
        this.enemyPool.forEach(function(enemy) {
            if (enemy.alive) {
                this.game.physics.arcade.collide(this.player, enemy, this.playerRammed, null, this);
                if (this.game.rnd.integerInRange(1, 500 - Math.min(this.game.score, 400)) <= 10)
                    this.enemyShoot(enemy);
                if (this.game.enemiesSpawned > 50) {
                    if (this.game.rnd.integerInRange(1, 1000) === 1) { // Level 2 - Move towards player... sometimes... ;)
                        if (this.player.x > enemy.x)
                            enemy.body.velocity.x = this.game.rnd.integerInRange(0, 200)
                        else
                            enemy.body.velocity.x = -this.game.rnd.integerInRange(0, 200);
                    }
                }
                this.playerBulletPool.forEach(function(bullet) {
                    this.game.physics.arcade.collide(bullet, enemy, this.enemyHit, null, this);
                    bullet.body.velocity.y = -this.BULLET_SPEED;
                }, this);
            }
        }, this);
        this.enemyBulletPool.forEach(function(bullet) {
            this.game.physics.arcade.collide(bullet, this.player, this.playerHit, null, this);
            bullet.body.velocity.y = this.BULLET_SPEED;
        }, this);

        // Check powerup pickup
        this.powerupPool.forEach(function(powerup) {
            this.game.physics.arcade.collide(powerup, this.player, this.collectPowerup, null, this);
        }, this);

        // Try to spawn an enemy
        if (this.game.rnd.integerInRange(1, 500 - Math.min(this.game.enemiesSpawned, 400)) <= 10)
            this.spawnEnemy();

        // Refresh FPS
        if (this.game.time.fps !== 0) {
            this.fpsText.setText(this.game.time.fps + ' FPS');
        }

        // Refresh score
        this.scoreText.setText('SCORE: ' + this.game.score);

        // Refresh health
        this.healthText.setText('HP: ' + Math.max(this.player.health, 0));

        // Check if weapon mode should be decreased
        if (this.game.weaponMode > 0)
            if (this.powerupShots <= this.shotsFired) {
                this.game.weaponMode--;
                this.powerupShots = this.shotsFired + this.WEAPON_POWERUP_LIMIT;
            }

        // Refresh weapon mode
        var powerupLeft = this.powerupShots - this.shotsFired;
        switch (this.game.weaponMode) {
            case 0:
                this.weaponModeText.setText('WEAPON: Single');
                break;
            case 1:
                this.weaponModeText.setText('WEAPON: Double (' + powerupLeft + ')');
                break;
            case 2:
                this.weaponModeText.setText('WEAPON: Triple (' + powerupLeft + ')');
                break;
        }
    },
    leftInputIsActive: function() {
        var isActive = false;

        isActive = (this.input.keyboard.isDown(Phaser.Keyboard.LEFT));// || this.game.input.activePointer.x+50<this.player.x);

        return isActive;
    },
    rightInputIsActive: function() {
        var isActive = false;

        isActive = (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT));// || this.game.input.activePointer.x-50>this.player.x);

        return isActive;
    },
    fireInputIsActive: function() {
        var isActive = false;

        isActive = (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR));// || this.input.activePointer.isDown);

        return isActive;
    },
    playerShoot: function() {
        if (!this.player.alive)
            return;
        if (this.lastBulletShotAt === undefined)
            this.lastBulletShotAt = 0;
        if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY)
            return;
        this.lastBulletShotAt = this.game.time.now;
        switch (this.game.weaponMode) {
            case 0:
                var bullet = this.playerBulletPool.getFirstDead();
                if (bullet === null || bullet === undefined)
                    return;
                bullet.revive();
                bullet.reset(this.player.x, this.player.y - 10);
                bullet.body.velocity.x = 0;
                bullet.body.velocity.y = -this.BULLET_SPEED;
                this.shotsFired++;
                break;
            case 1:
                var bullet = this.playerBulletPool.getFirstDead();
                if (bullet === null || bullet === undefined)
                    return;
                bullet.revive();
                bullet.reset(this.player.x - 20, this.player.y - 10);
                bullet.body.velocity.x = 0;
                bullet.body.velocity.y = -this.BULLET_SPEED;
                this.shotsFired++;

                var bullet2 = this.playerBulletPool.getFirstDead();
                if (bullet2 === null || bullet2 === undefined)
                    return;
                bullet2.revive();
                bullet2.reset(this.player.x + 20, this.player.y - 10);
                bullet2.body.velocity.x = 0;
                bullet2.body.velocity.y = -this.BULLET_SPEED;
                this.shotsFired++;
                break;
            case 2:
                var bullet = this.playerBulletPool.getFirstDead();
                if (bullet === null || bullet === undefined)
                    return;
                bullet.revive();
                bullet.reset(this.player.x, this.player.y - 10);
                bullet.body.velocity.x = 0;
                bullet.body.velocity.y = -this.BULLET_SPEED;
                this.shotsFired++;

                var bullet2 = this.playerBulletPool.getFirstDead();
                if (bullet2 === null || bullet2 === undefined)
                    return;
                bullet2.revive();
                bullet2.reset(this.player.x - 20, this.player.y - 10);
                bullet2.body.velocity.x = -50;
                bullet2.body.velocity.y = -this.BULLET_SPEED;
                this.shotsFired++;

                var bullet3 = this.playerBulletPool.getFirstDead();
                if (bullet3 === null || bullet3 === undefined)
                    return;
                bullet3.revive();
                bullet3.reset(this.player.x + 20, this.player.y - 10);
                bullet3.body.velocity.x = 50;
                bullet3.body.velocity.y = -this.BULLET_SPEED;
                this.shotsFired++;
                break;
        }
        if (this.playSound == 1)
            this.playerShotSound.play();
    },
    enemyShoot: function(enemy) {
        if (enemy.key == 'enemy3')
            return;
        if (this.lastEnemyBulletShotAt === undefined)
            this.lastEnemyBulletShotAt = 0;
        if (this.game.time.now - this.lastEnemyBulletShotAt < this.SHOT_DELAY * 2)
            return;
        this.lastEnemyBulletShotAt = this.game.time.now;

        var bullet = this.enemyBulletPool.getFirstDead();

        if (bullet === null || bullet === undefined)
            return;

        bullet.revive();
        bullet.reset(enemy.x, enemy.y + 32);
        bullet.body.velocity.x = 0;
        bullet.body.velocity.y = Math.min(200 + Math.floor(this.game.enemiesSpawned / 50) * 50, 700);
        if (enemy.key == 'enemy1')
            bullet.health = 4
        else if (enemy.key == 'enemy2')
            bullet.health = 5
        else if (enemy.key == 'enemy4')
            bullet.health = 2;
        if (this.playSound == 1)
            this.enemyShotSound.play();
        this.game.add.existing(bullet);
        this.enemyBulletPool.add(bullet);        
    },
    playerHit: function(bullet, player) {
        player.damage(bullet.health);
        bullet.kill();
        if (!player.alive)
            this.playerDown(null, player);
        else {
            this.game.tweens.removeAll();
            player.alpha = 1;
            this.game.add.tween(player).to({alpha: 0.05}, 100, Phaser.Easing.Linear.None, true, 0, 5, true);
        }
    },
    playerDown: function(enemy, player) {
        player.loadTexture('player_explode');
        player.animations.add('player_explode');
        player.kill();
        this.explode(player).animations.getAnimation('explode').onComplete.addOnce(this.gameOver, this, 0);
    },
    playerRammed: function(player, enemy) {
        this.enemyDown(null, enemy);
        this.playerDown(null, player);
    },
    gameOver: function() {
        this.game.state.start('gameover');
    },
    enemyHit: function(bullet, enemy) {
        enemy.damage(5);
        bullet.kill();
        if (!enemy.alive)
            this.enemyDown(bullet, enemy);
    },
    enemyDown: function(bullet, enemy) {
        enemy.kill();
        this.explode(enemy);
        switch (enemy.key) {
            case 'enemy1':
                this.game.score += 2;
                break;
            case 'enemy2':
                this.game.score += 3;
                break;
            case 'enemy3':
                this.game.score += 4;
                break;
            case 'enemy4':
                this.game.score += 1;
                break;
        }
        if (this.game.rnd.integerInRange(1, 100) <= 4)
            this.genPowerup(enemy.x, enemy.y);
    },
    spawnEnemy: function() {
        var enemy = this.enemyPool.getFirstDead();
        if (enemy === null || enemy === undefined)
            return;
        if (this.game.rnd.integerInRange(1, 10) <= 1 + Math.min(Math.floor(this.game.enemiesSpawned / 100), 5)) {
            enemy.loadTexture('enemy2')
            enemy.spawn(15);
        } else if (this.game.rnd.integerInRange(1, 10) <= 1 + Math.min(Math.floor(this.game.enemiesSpawned / 100), 5)) {
            enemy.loadTexture('enemy3')
            enemy.spawn(15);
        } else if (this.game.rnd.integerInRange(1, 10) <= 5) {
            enemy.loadTexture('enemy4')
            enemy.spawn(1);
        } else {
            enemy.loadTexture('enemy1');
            enemy.spawn(10);
        }
        this.game.add.existing(enemy);
        this.enemyPool.add(enemy);

    },
    explode: function(sprite) {
        var explosion = this.explosionPool.getFirstDead();
        if (explosion === null || explosion === undefined)
            return;
        explosion.reset(sprite.x, sprite.y);
        explosion.revive();
        explosion.animations.play('explode', 20, false);
        if (this.playSound == 1)
            this.explodeSound.play();
        return explosion;
    },
    genPowerup: function(x, y) {
        var powerupNr = this.game.rnd.integerInRange(0, this.NUMBER_OF_POWERUPS - 1);
        var powerup = this.powerupPool.getAt(powerupNr);
        if (powerup === null || powerup === undefined)
            return;
        if (powerupNr == 0) {
            if (this.game.weaponMode == 0)
                powerup.loadTexture('powerup_weapon2');
            else
                powerup.loadTexture('powerup_weapon3');
        }
        if (!powerup.alive) {
            powerup.reset(x, y);
            powerup.body.velocity.y = 150;
            powerup.revive();
        }
    },
    collectPowerup: function(powerup, player) {
        powerup.kill();
        if (powerup.key == 'powerup_weapon2' || powerup.key == 'powerup_weapon3') {
            if (this.powerupShots < this.shotsFired)
                this.powerupShots = this.shotsFired;
            if (this.game.weaponMode < 2)
                this.game.weaponMode += 1;
            this.powerupShots += this.WEAPON_POWERUP_LIMIT;
            if (this.playSound == 1)
                this.powerupSound.play();
        } else if (powerup.key == 'powerup_hp') {
            player.health = (Math.min(10, player.health + 5));
        }
    },
    soundOnOff: function() {
        if (this.soundIcon.key == 'soundOn') {
            this.soundIcon.loadTexture('soundOff');
            this.playSound = 0;
        } else {
            this.soundIcon.loadTexture('soundOn');
            this.playSound = 1;
        }
        if (!!localStorage)
            localStorage.setItem('playSound', this.playSound);
    }
}
module.exports = Play;