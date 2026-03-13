import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameRegistry, WeaponMode } from '../../src/utils/GameRegistry';
import Phaser from 'phaser';

// Mock Phaser.Scene
// We don't need to import Phaser to mock the interface if we just use 'as unknown as Phaser.Scene'
// but we might need it for types if we want to be strict.

describe('GameRegistry', () => {
    let gameRegistry: GameRegistry;
    let mockRegistry: {
        get: ReturnType<typeof vi.fn>;
        set: ReturnType<typeof vi.fn>;
    };
    let mockScene: Phaser.Scene;

    beforeEach(() => {
        // Create a fresh mock for registry each test
        mockRegistry = {
            get: vi.fn(),
            set: vi.fn(),
        };

        // Mock the Scene object
        mockScene = {
            registry: mockRegistry,
        } as unknown as Phaser.Scene;

        gameRegistry = new GameRegistry(mockScene);
    });

    it('should get score from registry', () => {
        mockRegistry.get.mockReturnValue(100);
        expect(gameRegistry.score).toBe(100);
        expect(mockRegistry.get).toHaveBeenCalledWith('score');
    });

    it('should set score to registry', () => {
        gameRegistry.score = 500;
        expect(mockRegistry.set).toHaveBeenCalledWith('score', 500);
    });

    it('should return default score of 0 if registry returns undefined', () => {
        mockRegistry.get.mockReturnValue(undefined);
        expect(gameRegistry.score).toBe(0);
    });

    it('should handle weaponMode enum', () => {
        mockRegistry.get.mockReturnValue(WeaponMode.DOUBLE);
        expect(gameRegistry.weaponMode).toBe(WeaponMode.DOUBLE);

        gameRegistry.weaponMode = WeaponMode.TRIPLE;
        expect(mockRegistry.set).toHaveBeenCalledWith('weaponMode', WeaponMode.TRIPLE);
    });

    it('should reset all values correctly', () => {
        // Mock localStorage
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1'); // '1' for true

        gameRegistry.reset();

        expect(mockRegistry.set).toHaveBeenCalledWith('score', 0);
        expect(mockRegistry.set).toHaveBeenCalledWith('health', 10);
        expect(mockRegistry.set).toHaveBeenCalledWith('weaponMode', WeaponMode.SINGLE);
        expect(mockRegistry.set).toHaveBeenCalledWith('shotsFired', 0);
        expect(mockRegistry.set).toHaveBeenCalledWith('powerupShots', 0);
        expect(mockRegistry.set).toHaveBeenCalledWith('enemiesSpawned', 0);
        expect(mockRegistry.set).toHaveBeenCalledWith('playSound', true);
    });
});
