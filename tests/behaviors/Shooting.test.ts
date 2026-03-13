import { describe, it, expect, vi } from 'vitest';
import { ProbabilisticShooting, NoShooting } from '../../src/behaviors/Shooting';
import { IMovable, IGameContext } from '../../src/interfaces/IGameEntities';

describe('Shooting Strategies', () => {
    describe('NoShooting', () => {
        it('should do nothing', () => {
            const strategy = new NoShooting();
            const mockEntity = {} as IMovable;
            const mockContext = { enemyShoot: vi.fn() } as unknown as IGameContext;
            
            strategy.update(mockEntity, mockContext, 100);
            expect(mockContext.enemyShoot).not.toHaveBeenCalled();
        });
    });

    describe('ProbabilisticShooting', () => {
        it('should call enemyShoot when random check passes', () => {
            const strategy = new ProbabilisticShooting();
            const mockEntity = {} as IMovable;
            const mockContext: IGameContext = {
                score: 0,
                getRandom: vi.fn().mockReturnValue(1), // Always 1, which is <= 10
                enemyShoot: vi.fn(),
                enemiesSpawned: 0,
                player: { x: 0, y: 0 }
            };

            strategy.update(mockEntity, mockContext, 100);
            expect(mockContext.enemyShoot).toHaveBeenCalledWith(mockEntity, 100);
        });

        it('should NOT call enemyShoot when random check fails', () => {
            const strategy = new ProbabilisticShooting();
            const mockEntity = {} as IMovable;
            const mockContext: IGameContext = {
                score: 0,
                getRandom: vi.fn().mockReturnValue(11), // 11 > 10
                enemyShoot: vi.fn(),
                enemiesSpawned: 0,
                player: { x: 0, y: 0 }
            };

            strategy.update(mockEntity, mockContext, 100);
            expect(mockContext.enemyShoot).not.toHaveBeenCalled();
        });

        it('should adjust fireChance based on score', () => {
            const strategy = new ProbabilisticShooting();
            const mockEntity = {} as IMovable;
            const mockContext: IGameContext = {
                score: 100,
                getRandom: vi.fn().mockReturnValue(100),
                enemyShoot: vi.fn(),
                enemiesSpawned: 0,
                player: { x: 0, y: 0 }
            };

            strategy.update(mockEntity, mockContext, 100);
            
            // fireChance = 500 - min(100, 400) = 400
            expect(mockContext.getRandom).toHaveBeenCalledWith(1, 400);
        });
    });
});
