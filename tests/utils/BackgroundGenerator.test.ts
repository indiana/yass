import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StarGenerator, NebulaGenerator } from '../../src/utils/BackgroundGenerator';

// Mock Phaser
vi.mock('phaser', () => ({
    default: {
        Math: {
            Between: vi.fn((min, max) => Math.floor(Math.random() * (max - min + 1) + min)),
            FloatBetween: vi.fn((min, max) => Math.random() * (max - min) + min)
        }
    }
}));

describe('BackgroundGenerator', () => {
    let mockScene: any;
    let mockGraphics: any;

    beforeEach(() => {
        mockGraphics = {
            fillStyle: vi.fn().mockReturnThis(),
            fillCircle: vi.fn().mockReturnThis(),
            generateTexture: vi.fn().mockReturnThis(),
            destroy: vi.fn()
        };

        mockScene = {
            make: {
                graphics: vi.fn().mockReturnValue(mockGraphics)
            }
        };
    });

    it('StarGenerator should generate a texture with correct parameters', () => {
        const config = {
            key: 'test_stars',
            count: 10,
            size: { min: 1, max: 2 },
            alpha: { min: 0.5, max: 1 }
        };

        const result = StarGenerator.generate(mockScene, config, 800, 600);

        expect(mockScene.make.graphics).toHaveBeenCalled();
        expect(mockGraphics.fillStyle.mock.calls.length).toBeGreaterThanOrEqual(10);
        expect(mockGraphics.fillCircle.mock.calls.length).toBeGreaterThanOrEqual(10);
        expect(mockGraphics.generateTexture).toHaveBeenCalledWith('test_stars', 800, 600);
        expect(mockGraphics.destroy).toHaveBeenCalled();
        expect(result).toBe('test_stars');
    });

    it('NebulaGenerator should generate a texture with correct parameters', () => {
        const config = {
            key: 'test_nebulae',
            count: 5,
            size: { min: 100, max: 200 },
            alpha: { min: 0.1, max: 0.2 }
        };

        const result = NebulaGenerator.generate(mockScene, config, 800, 600);

        expect(mockScene.make.graphics).toHaveBeenCalled();
        // 5 clusters * 20 particles = 100 base calls
        expect(mockGraphics.fillStyle.mock.calls.length).toBeGreaterThanOrEqual(100);
        expect(mockGraphics.fillCircle.mock.calls.length).toBeGreaterThanOrEqual(100);
        expect(mockGraphics.generateTexture).toHaveBeenCalledWith('test_nebulae', 800, 600);
        expect(mockGraphics.destroy).toHaveBeenCalled();
        expect(result).toBe('test_nebulae');
    });
});
