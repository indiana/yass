import { IShootingStrategy } from './IBehavior';
import { Enemy } from '../prefabs/Enemy';
import { Play } from '../scenes/Play';
import Phaser from 'phaser';

// A strategy for enemies that do not shoot.
export class NoShooting implements IShootingStrategy {
    update(enemy: Enemy, scene: Play, time: number): void {
        // This enemy does not fire.
    }
}

// A strategy for enemies that shoot based on a probability that scales with the player's score.
export class ProbabilisticShooting implements IShootingStrategy {
    update(enemy: Enemy, scene: Play, time: number): void {
        const fireChance = 500 - Math.min(scene.registryHelper.score, 400);
        if (Phaser.Math.Between(1, fireChance) <= 10) {
            scene.enemyShoot(enemy, time);
        }
    }
}
