'use strict';

var Background = function(game, parent) {
    Phaser.Group.call(this, game, parent);
    this.bg100 = new Phaser.TileSprite(game, 0, 0, game.stage.bounds.width, game.stage.bounds.height, 'bg100');
    this.add(this.bg100);
    this.bg80 = new Phaser.TileSprite(game, 0, 0, game.stage.bounds.width, game.stage.bounds.height, 'bg80');
    this.add(this.bg80);
    this.bg60 = new Phaser.TileSprite(game, 0, 0, game.stage.bounds.width, game.stage.bounds.height, 'bg60');
    this.add(this.bg60);  
};

Background.prototype = Object.create(Phaser.Group.prototype);
Background.prototype.constructor = Background;

Background.prototype.update = function() {
    this.bg100.tilePosition.y += 1;
    this.bg80.tilePosition.y += 2;
    this.bg60.tilePosition.y += 4;
  
};

module.exports = Background;
