import { describe, it, expect, vi } from 'vitest';
import { DefaultPlayerShooting } from '../../src/behaviors/PlayerShooting';
import { WeaponMode } from '../../src/utils/GameRegistry';
import { IPlayerMovable, IPlayerInput, IPlayerContext } from '../../src/interfaces/IPlayerBehaviors';

describe('DefaultPlayerShooting', () => {
    it('should not shoot if shootDown is false', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: false };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.SINGLE,
            canShoot: vi.fn().mockReturnValue(true),
            fireBullet: vi.fn(),
            playSound: vi.fn(),
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.fireBullet).not.toHaveBeenCalled();
    });

    it('should not shoot if canShoot returns false', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.SINGLE,
            canShoot: vi.fn().mockReturnValue(false),
            fireBullet: vi.fn(),
            playSound: vi.fn(),
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.fireBullet).not.toHaveBeenCalled();
    });

    it('should fire single bullet in SINGLE mode', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.SINGLE,
            canShoot: vi.fn().mockReturnValue(true),
            fireBullet: vi.fn(),
            playSound: vi.fn(),
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.fireBullet).toHaveBeenCalledTimes(1);
        expect(mockContext.fireBullet).toHaveBeenCalledWith(400, 490, 0, -500);
        expect(mockContext.onShootSuccess).toHaveBeenCalledWith(100);
        expect(mockContext.playSound).toHaveBeenCalledWith('player_shot');
    });

    it('should fire two bullets in DOUBLE mode', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.DOUBLE,
            canShoot: vi.fn().mockReturnValue(true),
            fireBullet: vi.fn(),
            playSound: vi.fn(),
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.fireBullet).toHaveBeenCalledTimes(2);
        expect(mockContext.fireBullet).toHaveBeenCalledWith(380, 490, 0, -500); // 400 - 20
        expect(mockContext.fireBullet).toHaveBeenCalledWith(420, 490, 0, -500); // 400 + 20
    });

    it('should fire three bullets in TRIPLE mode', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.TRIPLE,
            canShoot: vi.fn().mockReturnValue(true),
            fireBullet: vi.fn(),
            playSound: vi.fn(),
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.fireBullet).toHaveBeenCalledTimes(3);
        expect(mockContext.fireBullet).toHaveBeenCalledWith(400, 490, 0, -500); // center
        expect(mockContext.fireBullet).toHaveBeenCalledWith(380, 490, -50, -500); // left
        expect(mockContext.fireBullet).toHaveBeenCalledWith(420, 490, 50, -500); // right
    });
});
