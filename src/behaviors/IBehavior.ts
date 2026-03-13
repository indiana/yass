import { IMovable, IGameContext } from '../interfaces/IGameEntities';

// Interface for any movement logic
export interface IMovementStrategy {
    update(entity: IMovable, context: IGameContext): void;
}

// Interface for any shooting logic
export interface IShootingStrategy {
    update(entity: IMovable, context: IGameContext, time: number): void;
}
