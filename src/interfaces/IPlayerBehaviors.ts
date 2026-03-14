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

export interface IPlayerContext {
    weaponMode: WeaponMode;
    canShoot(time: number): boolean;
    fireBullet(x: number, y: number, vx: number, vy: number): void;
    playSound(key: string): void;
    onShootSuccess(time: number): void;
}

export interface IPlayerMovementStrategy {
    update(player: IPlayerMovable, input: IPlayerInput): void;
}

export interface IPlayerShootingStrategy {
    update(player: IPlayerMovable, input: IPlayerInput, context: IPlayerContext, time: number): void;
}
