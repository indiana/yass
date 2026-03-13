import { describe, it, expect, vi } from 'vitest';
import { SineWaveMovement, PlayerTrackingMovement } from '../../src/behaviors/Movement';
import { IMovable, IGameContext, IPlayerEntity } from '../../src/interfaces/IGameEntities';

describe('Movement Strategies', () => {
    describe('SineWaveMovement', () => {
        it('should move in a sine wave pattern based on Y position', () => {
            const movement = new SineWaveMovement();
            const mockEntity: IMovable = {
                x: 0,
                y: 150,
                setVelocityX: vi.fn(),
                setVelocityY: vi.fn(),
            };
            const mockContext = {} as IGameContext;

            // 150 * PI / 300 = PI / 2
            // sin(PI / 2) = 1
            // 200 * 1 = 200
            movement.update(mockEntity, mockContext);

            expect(mockEntity.setVelocityX).toHaveBeenCalledWith(200);
        });

        it('should have 0 velocity at PI', () => {
            const movement = new SineWaveMovement();
            const mockEntity: IMovable = {
                x: 0,
                y: 300, // 300 * PI / 300 = PI
                setVelocityX: vi.fn(),
                setVelocityY: vi.fn(),
            };
            const mockContext = {} as IGameContext;

            movement.update(mockEntity, mockContext);

            // sin(PI) is effectively 0 (floating point might be tiny close to 0)
            const call = vi.mocked(mockEntity.setVelocityX).mock.calls[0][0];
            expect(Math.abs(call)).toBeLessThan(0.0001);
        });
    });

    describe('PlayerTrackingMovement', () => {
        it('should not track if enemies spawned <= 50', () => {
            const movement = new PlayerTrackingMovement();
            const mockEntity: IMovable = { x: 100, y: 0, setVelocityX: vi.fn(), setVelocityY: vi.fn() };
            const mockContext: IGameContext = {
                enemiesSpawned: 50,
                player: { x: 0, y: 0 },
                getRandom: vi.fn(),
            };

            movement.update(mockEntity, mockContext);
            expect(mockContext.getRandom).not.toHaveBeenCalled();
            expect(mockEntity.setVelocityX).not.toHaveBeenCalled();
        });

        it('should move towards player (left) when random condition met', () => {
            const movement = new PlayerTrackingMovement();
            const mockEntity: IMovable = { x: 100, y: 0, setVelocityX: vi.fn(), setVelocityY: vi.fn() };
            const mockPlayer: IPlayerEntity = { x: 50, y: 0 }; // Player is left
            const mockContext: IGameContext = {
                enemiesSpawned: 51,
                player: mockPlayer,
                getRandom: vi.fn(),
            };

            const getRandomMock = vi.mocked(mockContext.getRandom);
            getRandomMock.mockReturnValueOnce(1); // Trigger condition (1 in 1000)
            getRandomMock.mockReturnValueOnce(50); // Speed

            movement.update(mockEntity, mockContext);

            // Player (50) < Enemy (100) -> Move Left (negative)
            expect(mockEntity.setVelocityX).toHaveBeenCalledWith(-50);
        });

        it('should move towards player (right) when random condition met', () => {
            const movement = new PlayerTrackingMovement();
            const mockEntity: IMovable = { x: 100, y: 0, setVelocityX: vi.fn(), setVelocityY: vi.fn() };
            const mockPlayer: IPlayerEntity = { x: 150, y: 0 }; // Player is right
            const mockContext: IGameContext = {
                enemiesSpawned: 51,
                player: mockPlayer,
                getRandom: vi.fn(),
            };

            const getRandomMock = vi.mocked(mockContext.getRandom);
            getRandomMock.mockReturnValueOnce(1); // Trigger condition
            getRandomMock.mockReturnValueOnce(50); // Speed

            movement.update(mockEntity, mockContext);

            // Player (150) > Enemy (100) -> Move Right (positive)
            expect(mockEntity.setVelocityX).toHaveBeenCalledWith(50);
        });
    });
});
