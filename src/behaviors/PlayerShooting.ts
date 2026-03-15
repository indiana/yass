import { IPlayerShootingStrategy, IPlayerMovable, IPlayerInput, IPlayerContext } from '../interfaces/IPlayerBehaviors';
import { WeaponMode } from '../utils/GameRegistry';

export class DefaultPlayerShooting implements IPlayerShootingStrategy {
    private BULLET_SPEED = 500;

    update(player: IPlayerMovable, input: IPlayerInput, context: IPlayerContext, time: number): void {
        if (!input.shootDown) return;
        if (!context.canShoot(time)) return;

        const weaponMode = context.weaponMode;
        const bulletCount = weaponMode + 1;
        
        for (let i = 0; i < bulletCount; i++) {
            let offsetX = 0;
            let velocityX = 0;
            
            if (weaponMode === WeaponMode.DOUBLE) {
                offsetX = i === 0 ? -20 : 20;
            } else if (weaponMode === WeaponMode.TRIPLE) {
                if (i === 1) { offsetX = -20; velocityX = -50; }
                else if (i === 2) { offsetX = 20; velocityX = 50; }
            }
            
            context.projectileManager.fire(
                player.x + offsetX, 
                player.y - 10, 
                velocityX, 
                -this.BULLET_SPEED,
                1, // Damage
                true // isPlayer
            );
        }

        context.onShootSuccess(time);
    }
}
