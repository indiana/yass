import { describe, it, expect, vi } from 'vitest';
import { PowerupSpawner } from '../../src/managers/PowerupSpawner';
import { IPowerupSpawnerContext, IPowerup } from '../../src/interfaces/IGameEntities';

// Mock phaser BEFORE importing PowerupSpawner which might import configs that use Phaser
vi.mock('phaser', () => {
    return {
        default: {
            Math: {
                RND: {
                    pick: vi.fn((arr) => arr[0])
                },
                FloatBetween: vi.fn((min, _max) => min),
                Between: vi.fn((min, _max) => min)
            }
        }
    };
});

describe('PowerupSpawner', () => {
    it('should spawn a powerup when random check passes', () => {
        const mockPowerup: IPowerup = { spawn: vi.fn() };
        const mockContext: IPowerupSpawnerContext = {
            getPowerup: vi.fn().mockReturnValue(mockPowerup),
            getRandom: vi.fn().mockReturnValue(5) // 5 <= 10
        };

        const spawner = new PowerupSpawner(mockContext);
        spawner.trySpawnPowerup(100, 200, 10);

        expect(mockContext.getRandom).toHaveBeenCalledWith(1, 100);
        expect(mockContext.getPowerup).toHaveBeenCalled();
        expect(mockPowerup.spawn).toHaveBeenCalled();
    });

    it('should NOT spawn a powerup when random check fails', () => {
        const mockPowerup: IPowerup = { spawn: vi.fn() };
        const mockContext: IPowerupSpawnerContext = {
            getPowerup: vi.fn().mockReturnValue(mockPowerup),
            getRandom: vi.fn().mockReturnValue(11) // 11 > 10
        };

        const spawner = new PowerupSpawner(mockContext);
        spawner.trySpawnPowerup(100, 200, 10);

        expect(mockContext.getPowerup).not.toHaveBeenCalled();
        expect(mockPowerup.spawn).not.toHaveBeenCalled();
    });

    it('should handle empty pool gracefully', () => {
        const mockContext: IPowerupSpawnerContext = {
            getPowerup: vi.fn().mockReturnValue(null),
            getRandom: vi.fn().mockReturnValue(1)
        };

        const spawner = new PowerupSpawner(mockContext);
        // Should not throw
        spawner.trySpawnPowerup(100, 200, 10);
        
        expect(mockContext.getPowerup).toHaveBeenCalled();
    });
});
