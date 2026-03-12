
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.game.add.sprite(this.game.width/2, 150, 'splash').anchor.setTo(0.5,0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('player', 'assets/starship3.png', 51, 51);
    this.load.spritesheet('player_explode', 'assets/player_explode.png', 51, 51);
    this.load.image('projectile', 'assets/projectile.png');
    this.load.image('projectile2', 'assets/projectile2.png');
    this.load.spritesheet('enemy1', 'assets/enemy_02.png', 51, 51);
    this.load.spritesheet('enemy2', 'assets/enemy_03.png', 51, 51);
    this.load.spritesheet('enemy3', 'assets/enemy_05.png', 39, 51);
    this.load.spritesheet('enemy4', 'assets/enemy_01.png', 51, 51);
    this.load.image('powerup_weapon2', 'assets/powerup_weapon2.png');    
    this.load.image('powerup_weapon3', 'assets/powerup_weapon3.png');    
    this.load.image('powerup_hp', 'assets/powerup_hp.png');    
    this.load.image('bg100', 'assets/Parallax100.png');
    this.load.image('bg80', 'assets/Parallax80.png');
    this.load.image('bg60', 'assets/Parallax60.png');
    this.load.image('background', 'assets/background.jpg');
    this.load.image('soundOn', 'assets/sound_on.png');
    this.load.image('soundOff', 'assets/sound_off.png');
    
    this.load.bitmapFont('modern_led', 'assets/Modern LED Board 7/font.png', 'assets/Modern LED Board 7/font.fnt');
    
    this.load.audio('player_shot', 'assets/player_shot.wav');
    this.load.audio('enemy_shot', 'assets/enemy_shot.wav');
    this.load.audio('enemy_explode', 'assets/enemy_explode.wav');
    this.load.audio('powerup', 'assets/powerup.wav');
    
    this.load.spritesheet('explosion', 'assets/explosion3.png', 64, 64);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
