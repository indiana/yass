import { IShootingStrategy } from './IBehavior';
import { IMovable, IGameContext } from '../interfaces/IGameEntities';

// A strategy for enemies that do not shoot.
export class NoShooting implements IShootingStrategy {
    update(_entity: IMovable, _context: IGameContext, _time: number): void {
        // This enemy does not fire.
    }
}

// A strategy for enemies that shoot based on a probability that scales with the player's score.
export class ProbabilisticShooting implements IShootingStrategy {
    update(entity: IMovable, context: IGameContext, time: number): void {
        const fireChance = 500 - Math.min(context.score, 400);
        if (context.getRandom(1, fireChance) <= 10) {
            context.enemyShoot(entity, time);
        }
    }
}
