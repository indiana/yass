import { IPlayerMovementStrategy, IPlayerMovable, IPlayerInput } from '../interfaces/IPlayerBehaviors';

export class DefaultPlayerMovement implements IPlayerMovementStrategy {
    private MAX_SPEED = 500;
    private ACCELERATION = 5000;
    private FRICTION = 50;
    private PLAYER_HEIGHT = 500;

    update(player: IPlayerMovable, input: IPlayerInput): void {
        if (input.leftDown) {
            player.setAccelerationX(-this.ACCELERATION);
        } else if (input.rightDown) {
            player.setAccelerationX(this.ACCELERATION);
        } else {
            player.setAccelerationX(0);
            const velocityX = player.getVelocityX();
            if (Math.abs(velocityX) < this.FRICTION) {
                player.setVelocityX(0);
            } else {
                player.setVelocityX(velocityX > 0 ? velocityX - this.FRICTION : velocityX + this.FRICTION);
            }
        }
        
        // Keep at fixed height
        player.setY(this.PLAYER_HEIGHT);
    }
}
