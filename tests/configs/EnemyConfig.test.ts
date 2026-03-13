import { describe, it, expect, vi } from 'vitest';

// Mock Phaser before importing configs
vi.mock('phaser', () => ({
    default: {
        Math: {
            Between: vi.fn((min, _max) => min)
        }
    }
}));

import { EnemyTypes } from '../../src/configs/EnemyConfig';

describe('EnemyConfig', () => {
    it('should have valid enemy types defined', () => {
        const types = Object.keys(EnemyTypes);
        expect(types.length).toBeGreaterThan(0);
        expect(types).toContain('grunt');
    });

    it('should have positive hp and score for all enemies', () => {
        for (const key in EnemyTypes) {
            const enemy = EnemyTypes[key];
            expect(enemy.hp).toBeGreaterThan(0);
            expect(enemy.score).toBeGreaterThan(0);
            expect(enemy.baseYVelocity).toBeGreaterThan(0);
        }
    });

    it('should have movement and shooting strategies defined', () => {
        for (const key in EnemyTypes) {
            const enemy = EnemyTypes[key];
            expect(enemy.movement).toBeDefined();
            expect(enemy.shooting).toBeDefined();
        }
    });
});
