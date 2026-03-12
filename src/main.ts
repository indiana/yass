import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preload } from './scenes/Preload';
import { Menu } from './scenes/Menu';
import { Play } from './scenes/Play';
import { GameOver } from './scenes/GameOver';
import { PauseScene } from './scenes/PauseScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [Boot, Preload, Menu, Play, GameOver, PauseScene]
};

new Phaser.Game(config);