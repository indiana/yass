import { IMovable, IGameContext } from '../interfaces/IGameEntities';
import { Enemy } from '../prefabs/Enemy';
import { Play } from '../scenes/Play';

// Interface for any movement logic
export interface IMovementStrategy {
    update(entity: IMovable, context: IGameContext): void;
}

// Interface for any shooting logic
export interface IShootingStrategy {
    update(enemy: Enemy, scene: Play, time: number): void;
}
