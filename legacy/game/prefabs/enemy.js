'use strict';

var Enemy = function(game, id) {
    Phaser.Sprite.call(this, game, 20, 20, id);
    this.anchor.setTo(0.5, 0.5);  
    game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true; 
    this.body.collideWorldBounds = false;
    this.body.immovable = true;
    this.kill();
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
    if(this.key == 'enemy4')
        this.body.velocity.x = 200 * Math.sin(this.y*Math.PI/300);
};

Enemy.prototype.spawn = function(hp) {
    if(this.key == 'enemy4')
        this.startX = this.game.rnd.integerInRange(24, 576);
    else
        this.startX = this.game.rnd.integerInRange(24, 776);
    this.reset(this.startX, 0, hp);
    
    this.body.velocity.y = 150 + this.game.rnd.integerInRange(1, 100);        
    if(this.key == 'enemy3')
        this.body.velocity.y += 100;
    
    if(this.key == 'enemy4')
        this.body.velocity.x = 0;
    else if(this.key == 'enemy2')
        this.body.velocity.x = -50 + this.game.rnd.integerInRange(0, 100);        
    else
        this.body.velocity.x = -5 + this.game.rnd.integerInRange(0, 10);        
    
    this.revive(hp);
    this.game.enemiesSpawned++;
    if(this.key == 'enemy1') {
        this.animations.add('flame1');
        this.animations.play('flame1', 12, true);
    } else if(this.key == 'enemy2') {
        this.animations.add('flame2');
        this.animations.play('flame2', 12, true);
    } else if(this.key == 'enemy3') {
        this.animations.add('flame3');
        this.animations.play('flame3', 12, true);
    } else if(this.key == 'enemy4') {
        this.animations.add('flame4');
        this.animations.play('flame4', 12, true);
    }
    
};

module.exports = Enemy;
