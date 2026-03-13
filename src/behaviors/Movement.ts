import { IMovementStrategy } from './IBehavior';
import { IMovable, IGameContext } from '../interfaces/IGameEntities';

// A strategy for enemies that do not move horizontally after their initial velocity is set.
export class StaticXMovement implements IMovementStrategy {
    update(_entity: IMovable, _context: IGameContext): void {
        // No ongoing horizontal movement logic needed.
    }
}

// A strategy for the sine-wave movement of the 'scout' enemy.
export class SineWaveMovement implements IMovementStrategy {
    update(entity: IMovable, _context: IGameContext): void {
        entity.setVelocityX(200 * Math.sin(entity.y * Math.PI / 300));
    }
}

// A strategy that gives enemies a chance to track the player's X position.
export class PlayerTrackingMovement implements IMovementStrategy {
    update(entity: IMovable, context: IGameContext): void {
        if (context.enemiesSpawned > 50 && context.getRandom(1, 1000) === 1) {
            const player = context.player;
            const velocityX = player.x > entity.x ? context.getRandom(0, 200) : -context.getRandom(0, 200);
            entity.setVelocityX(velocityX);
        }
    }
}
