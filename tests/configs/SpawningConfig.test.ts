import { describe, it, expect } from 'vitest';
import { SpawningConfiguration } from '../../src/configs/SpawningConfig';

describe('SpawningConfiguration', () => {
    it('should be ordered by minEnemiesSpawned', () => {
        for (let i = 0; i < SpawningConfiguration.length - 1; i++) {
            expect(SpawningConfiguration[i].minEnemiesSpawned)
                .toBeLessThan(SpawningConfiguration[i + 1].minEnemiesSpawned);
        }
    });

    it('should have non-empty spawn pools', () => {
        SpawningConfiguration.forEach(stage => {
            expect(stage.spawnPool.length).toBeGreaterThan(0);
            
            const totalWeight = stage.spawnPool.reduce((sum, e) => sum + e.weight, 0);
            expect(totalWeight).toBeGreaterThan(0);
        });
    });

    it('should only contain existing enemy types', () => {
        // We'll import EnemyTypes here to check against it
        // (Assuming EnemyConfig is valid since we test it separately)
        const validTypes = ['grunt', 'heavyGrunt', 'kamikaze', 'scout'];
        
        SpawningConfiguration.forEach(stage => {
            stage.spawnPool.forEach(enemy => {
                expect(validTypes).toContain(enemy.type);
            });
        });
    });
});
