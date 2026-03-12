'use strict';

var Powerup = function(game, x, y, id) {
    Phaser.Sprite.call(this, game, x, y, id);
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;           
    this.kill();
};

Powerup.prototype = Object.create(Phaser.Sprite.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.update = function() {
    if(!this.inWorld)
        this.kill();    
};

module.exports = Powerup;
