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
            projectileManager: { fire: vi.fn() },
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.projectileManager.fire).not.toHaveBeenCalled();
    });

    it('should not shoot if canShoot returns false', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.SINGLE,
            canShoot: vi.fn().mockReturnValue(false),
            projectileManager: { fire: vi.fn() },
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.projectileManager.fire).not.toHaveBeenCalled();
    });

    it('should fire single bullet in SINGLE mode', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.SINGLE,
            canShoot: vi.fn().mockReturnValue(true),
            projectileManager: { fire: vi.fn() },
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.projectileManager.fire).toHaveBeenCalledTimes(1);
        expect(mockContext.projectileManager.fire).toHaveBeenCalledWith(400, 490, 0, -500, 1, true);
        expect(mockContext.onShootSuccess).toHaveBeenCalledWith(100);
    });

    it('should fire two bullets in DOUBLE mode', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.DOUBLE,
            canShoot: vi.fn().mockReturnValue(true),
            projectileManager: { fire: vi.fn() },
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.projectileManager.fire).toHaveBeenCalledTimes(2);
        expect(mockContext.projectileManager.fire).toHaveBeenCalledWith(380, 490, 0, -500, 1, true); // 400 - 20
        expect(mockContext.projectileManager.fire).toHaveBeenCalledWith(420, 490, 0, -500, 1, true); // 400 + 20
    });

    it('should fire three bullets in TRIPLE mode', () => {
        const strategy = new DefaultPlayerShooting();
        const mockPlayer: IPlayerMovable = { x: 400, y: 500, setAccelerationX: vi.fn(), setVelocityX: vi.fn(), getVelocityX: vi.fn(), setY: vi.fn() };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: true };
        const mockContext: IPlayerContext = {
            weaponMode: WeaponMode.TRIPLE,
            canShoot: vi.fn().mockReturnValue(true),
            projectileManager: { fire: vi.fn() },
            onShootSuccess: vi.fn()
        };

        strategy.update(mockPlayer, mockInput, mockContext, 100);

        expect(mockContext.projectileManager.fire).toHaveBeenCalledTimes(3);
        expect(mockContext.projectileManager.fire).toHaveBeenCalledWith(400, 490, 0, -500, 1, true); // center
        expect(mockContext.projectileManager.fire).toHaveBeenCalledWith(380, 490, -50, -500, 1, true); // left
        expect(mockContext.projectileManager.fire).toHaveBeenCalledWith(420, 490, 50, -500, 1, true); // right
    });
});
