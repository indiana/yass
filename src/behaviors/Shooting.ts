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
    update(entity: IMovable, context: IGameContext, _time: number): void {
        const fireChance = 500 - Math.min(context.score, 400);
        if (context.getRandom(1, fireChance) <= 10) {
            // Dynamic velocity based on progression
            const velocityY = Math.min(
                400 + Math.floor(context.enemiesSpawned / 50) * 50,
                800
            );
            context.projectileManager.fire(
                entity.x, 
                entity.y + 32, 
                0, 
                velocityY, 
                1, // Damage
                false // isPlayer
            );
        }
    }
}
