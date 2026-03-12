import { Enemy } from '../prefabs/Enemy';
import { Play } from '../scenes/Play';

// Interface for any movement logic
export interface IMovementStrategy {
    update(enemy: Enemy, scene: Play): void;
}

// Interface for any shooting logic
export interface IShootingStrategy {
    update(enemy: Enemy, scene: Play, time: number): void;
}
