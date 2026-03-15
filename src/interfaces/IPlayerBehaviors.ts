import { WeaponMode } from '../utils/GameRegistry';

export interface IPlayerMovable {
    x: number;
    y: number;
    setAccelerationX(accel: number): void;
    setVelocityX(vx: number): void;
    getVelocityX(): number;
    setY(y: number): void;
}

export interface IPlayerInput {
    leftDown: boolean;
    rightDown: boolean;
    shootDown: boolean;
}

import { IProjectileManager } from './IGameEntities';

export interface IPlayerContext {
    weaponMode: WeaponMode;
    canShoot(time: number): boolean;
    projectileManager: IProjectileManager;
    onShootSuccess(time: number): void;
}

export interface IPlayerMovementStrategy {
    update(player: IPlayerMovable, input: IPlayerInput): void;
}

export interface IPlayerShootingStrategy {
    update(player: IPlayerMovable, input: IPlayerInput, context: IPlayerContext, time: number): void;
}
