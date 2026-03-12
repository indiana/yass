
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'background');
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);
    
    this.titleText = this.game.add.bitmapText(this.game.world.centerX - 180, this.game.world.height / 2 - 70, 'modern_led', 'Yet Another', 36);
    this.titleText2 = this.game.add.bitmapText(this.game.world.centerX - 220, this.game.world.height / 2, 'modern_led', 'Space Shooter', 36);
    
    this.instructionsText = this.game.add.text(this.game.world.centerX, this.game.world.height - 80, 'Press SPACE or ENTER or click anywhere to play', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);
    this.instructionsText2 = this.game.add.text(this.game.world.centerX, this.game.world.height - 50, 'Use left and right arrow to move, space to shoot', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText2.anchor.setTo(0.5, 0.5);
    this.instructionsText3 = this.game.add.text(this.game.world.centerX, this.game.world.height - 20, 'P - Pause, S - Sound on/off', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText3.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.SPACEBAR
    ]);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed() || this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
        this.game.state.start('play');
    }
  }
};

module.exports = Menu;
