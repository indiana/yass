
'use strict';
function GameOver() {
}

GameOver.prototype = {
    preload: function() {

    },
    create: function() {
        this.background = this.game.add.sprite(0, 0, 'background');
        this.titleText = this.game.add.bitmapText(250, 100, 'modern_led', 'Game Over!');

        this.game.add.text(350, 170, 'Your score: ' + this.game.score, {font: '18px Arial', fill: '#ffffff', align: 'center'});
        if (location.href != 'http://localhost:9000/') {
            var leaderboard = new Clay.Leaderboard({id: 'yass_leaderboard'});
            leaderboard.post({hideUI: true, score: this.game.score}, function(response) {
                leaderboard.fetch({limit: 10, getRank: true}, function(results) {
                    if (this.game.state.getCurrentState() instanceof GameOver) {
                        this.game.add.text(300, 200, 'HIGHSCORES:', {font: '16px Arial', fill: '#ffffff', align: 'left'});
                        results.data.forEach(function(score) {
                            this.game.add.text(320, 200 + score.rank * 20, score.name + ': ', {font: '16px Arial', fill: '#ffffff', align: 'left'});
                            this.game.add.text(450, 200 + score.rank * 20, score.score, {font: '16px Arial', fill: '#ffffff', align: 'right'});
                        }, this);
                    }
                }.bind(this));
            }.bind(this));
        }

        this.instructionText = this.game.add.text(this.game.world.centerX, 450, 'Press ENTER or click to play again', {font: '16px Arial', fill: '#ffffff', align: 'center'});
        this.instructionText.anchor.setTo(0.5, 0.5);
    },
    update: function() {
        if (this.game.input.activePointer.justPressed() || this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.game.state.start('play');
        }
    }
};
module.exports = GameOver;
