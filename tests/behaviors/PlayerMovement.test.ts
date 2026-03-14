import { describe, it, expect, vi } from 'vitest';
import { DefaultPlayerMovement } from '../../src/behaviors/PlayerMovement';
import { IPlayerMovable, IPlayerInput } from '../../src/interfaces/IPlayerBehaviors';

describe('DefaultPlayerMovement', () => {
    it('should accelerate left when leftDown is true', () => {
        const strategy = new DefaultPlayerMovement();
        const mockPlayer: IPlayerMovable = {
            x: 400, y: 500,
            setAccelerationX: vi.fn(),
            setVelocityX: vi.fn(),
            getVelocityX: vi.fn().mockReturnValue(0),
            setY: vi.fn()
        };
        const mockInput: IPlayerInput = { leftDown: true, rightDown: false, shootDown: false };

        strategy.update(mockPlayer, mockInput);

        expect(mockPlayer.setAccelerationX).toHaveBeenCalledWith(-5000);
    });

    it('should accelerate right when rightDown is true', () => {
        const strategy = new DefaultPlayerMovement();
        const mockPlayer: IPlayerMovable = {
            x: 400, y: 500,
            setAccelerationX: vi.fn(),
            setVelocityX: vi.fn(),
            getVelocityX: vi.fn().mockReturnValue(0),
            setY: vi.fn()
        };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: true, shootDown: false };

        strategy.update(mockPlayer, mockInput);

        expect(mockPlayer.setAccelerationX).toHaveBeenCalledWith(5000);
    });

    it('should apply friction when no movement keys are pressed', () => {
        const strategy = new DefaultPlayerMovement();
        const mockPlayer: IPlayerMovable = {
            x: 400, y: 500,
            setAccelerationX: vi.fn(),
            setVelocityX: vi.fn(),
            getVelocityX: vi.fn().mockReturnValue(100),
            setY: vi.fn()
        };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: false };

        strategy.update(mockPlayer, mockInput);

        expect(mockPlayer.setAccelerationX).toHaveBeenCalledWith(0);
        expect(mockPlayer.setVelocityX).toHaveBeenCalledWith(50); // 100 - 50
    });

    it('should stop when velocity is low and no movement keys are pressed', () => {
        const strategy = new DefaultPlayerMovement();
        const mockPlayer: IPlayerMovable = {
            x: 400, y: 500,
            setAccelerationX: vi.fn(),
            setVelocityX: vi.fn(),
            getVelocityX: vi.fn().mockReturnValue(30),
            setY: vi.fn()
        };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: false };

        strategy.update(mockPlayer, mockInput);

        expect(mockPlayer.setVelocityX).toHaveBeenCalledWith(0);
    });

    it('should keep player at fixed height', () => {
        const strategy = new DefaultPlayerMovement();
        const mockPlayer: IPlayerMovable = {
            x: 400, y: 400, // Wrong height
            setAccelerationX: vi.fn(),
            setVelocityX: vi.fn(),
            getVelocityX: vi.fn().mockReturnValue(0),
            setY: vi.fn()
        };
        const mockInput: IPlayerInput = { leftDown: false, rightDown: false, shootDown: false };

        strategy.update(mockPlayer, mockInput);

        expect(mockPlayer.setY).toHaveBeenCalledWith(500);
    });
});
