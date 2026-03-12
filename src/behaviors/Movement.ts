import { IMovementStrategy } from './IBehavior';
import { Enemy } from '../prefabs/Enemy';
import { Play } from '../scenes/Play';
import Phaser from 'phaser';

// A strategy for enemies that do not move horizontally after their initial velocity is set.
export class StaticXMovement implements IMovementStrategy {
    update(enemy: Enemy, scene: Play): void {
        // No ongoing horizontal movement logic needed.
    }
}

// A strategy for the sine-wave movement of the 'scout' enemy.
export class SineWaveMovement implements IMovementStrategy {
    update(enemy: Enemy, scene: Play): void {
        enemy.setVelocityX(200 * Math.sin(enemy.y * Math.PI / 300));
    }
}

// A strategy that gives enemies a chance to track the player's X position.
export class PlayerTrackingMovement implements IMovementStrategy {
    update(enemy: Enemy, scene: Play): void {
        if (scene.registryHelper.enemiesSpawned > 50 && Phaser.Math.Between(1, 1000) === 1) {
            const player = scene.player;
            const velocityX = player.x > enemy.x ? Phaser.Math.Between(0, 200) : -Phaser.Math.Between(0, 200);
            enemy.setVelocityX(velocityX);
        }
    }
}
