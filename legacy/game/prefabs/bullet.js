'use strict';

var Bullet = function(game, id) {
    Phaser.Sprite.call(this, game, 0, 0, id);
    this.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true; 
    this.body.collideWorldBounds = false;
    this.kill();  
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
};

module.exports = Bullet;
