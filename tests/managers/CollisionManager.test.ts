import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollisionManager, ICollisionManagerContext } from '../../src/managers/CollisionManager';
import { GameConstants } from '../../src/configs/GameConstants';

// Mock Phaser
vi.mock('phaser', () => ({
    default: {
        Scene: class {},
        GameObjects: { Group: class {} },
        Physics: { Arcade: { Group: class {} } }
    }
}));

describe('CollisionManager', () => {
    let context: ICollisionManagerContext;
    let manager: CollisionManager;
    let mockScene: any;
    let mockRegistry: any;
    let mockPowerupSpawner: any;
    let mockExplosionPool: any;
    let mockEnemyPool: any;

    beforeEach(() => {
        mockScene = {
            tweens: { 
                add: vi.fn(),
                killTweensOf: vi.fn()
            },
            scene: { stop: vi.fn(), start: vi.fn(), isActive: vi.fn() },
            time: { delayedCall: vi.fn() },
            sound: { play: vi.fn() }
        };
        mockRegistry = {
            health: 10,
            score: 0,
            playSound: true,
            damagePlayer: vi.fn((amount) => { mockRegistry.health -= amount; }),
            addScore: vi.fn((amount) => { mockRegistry.score += amount; }),
            healPlayer: vi.fn(),
            upgradeWeapon: vi.fn(),
            downgradeWeapon: vi.fn(),
            setPowerupShots: vi.fn(),
            addPowerupShots: vi.fn(),
            toggleSound: vi.fn()
        };
        mockPowerupSpawner = { trySpawnPowerup: vi.fn() };
        mockExplosionPool = { get: vi.fn() };
        mockEnemyPool = {};

        context = {
            scene: mockScene,
            registry: mockRegistry,
            powerupSpawner: mockPowerupSpawner,
            explosionPool: mockExplosionPool,
            enemyPool: mockEnemyPool
        };

        manager = new CollisionManager(context);
    });

    it('handleEnemyHit should disable bullet and damage enemy', () => {
        const bullet = { disableBody: vi.fn() } as any;
        const enemy = { damage: vi.fn().mockReturnValue(false), disableBody: vi.fn() } as any;

        manager.handleEnemyHit(bullet, enemy);

        expect(bullet.disableBody).toHaveBeenCalledWith(true, true);
        expect(enemy.damage).toHaveBeenCalledWith(GameConstants.ENEMY.DAMAGE_ON_HIT);
        expect(enemy.disableBody).not.toHaveBeenCalled();
    });

    it('handleEnemyHit should explode and score if enemy dies', () => {
        const bullet = { disableBody: vi.fn() } as any;
        const enemy = { 
            damage: vi.fn().mockReturnValue(true), 
            disableBody: vi.fn(),
            x: 100, y: 100,
            config: { score: 50, powerupChance: 10 }
        } as any;
        const explosion = { setActive: vi.fn().mockReturnThis(), setVisible: vi.fn().mockReturnThis(), play: vi.fn() };
        mockExplosionPool.get.mockReturnValue(explosion);

        manager.handleEnemyHit(bullet, enemy);

        expect(enemy.disableBody).toHaveBeenCalled();
        expect(mockRegistry.score).toBe(50);
        expect(mockPowerupSpawner.trySpawnPowerup).toHaveBeenCalledWith(100, 100, 10);
        expect(explosion.play).toHaveBeenCalledWith('explode');
    });

    it('handlePlayerHit should damage player', () => {
        const player = { disableBody: vi.fn(), setAlpha: vi.fn() } as any;
        const bullet = { disableBody: vi.fn(), getData: vi.fn().mockReturnValue(2) } as any;
        
        manager.handlePlayerHit(player, bullet);

        expect(mockRegistry.health).toBe(8);
        expect(bullet.disableBody).toHaveBeenCalled();
        expect(mockScene.tweens.add).toHaveBeenCalled(); // Should flash player
        expect(player.disableBody).not.toHaveBeenCalled(); // Not dead
    });

    it('handlePlayerHit should kill player if health <= 0', () => {
        mockRegistry.health = 1;
        const player = { disableBody: vi.fn(), x: 50, y: 50 } as any;
        const bullet = { disableBody: vi.fn(), getData: vi.fn().mockReturnValue(2) } as any;
        const explosion = { setActive: vi.fn().mockReturnThis(), setVisible: vi.fn().mockReturnThis(), play: vi.fn() };
        mockExplosionPool.get.mockReturnValue(explosion);

        manager.handlePlayerHit(player, bullet);

        expect(mockRegistry.health).toBe(-1);
        expect(player.disableBody).toHaveBeenCalled();
        expect(mockScene.scene.start).not.toHaveBeenCalled(); // Should happen after delay
        expect(mockScene.time.delayedCall).toHaveBeenCalled();
    });

    it('handleCollectPowerup should apply effect', () => {
        const player = {} as any;
        const powerup = { applyEffect: vi.fn(), disableBody: vi.fn() } as any;

        manager.handleCollectPowerup(player, powerup);

        expect(powerup.applyEffect).toHaveBeenCalledWith(mockScene);
        expect(powerup.disableBody).toHaveBeenCalled();
    });

    it('handlePlayerRammed should kill player and enemy', () => {
        const player = { disableBody: vi.fn(), x: 50, y: 50 } as any;
        const enemy = { 
            disableBody: vi.fn(), 
            x: 100, y: 100,
            config: { score: 100, powerupChance: 0 }
        } as any;
        const explosion = { setActive: vi.fn().mockReturnThis(), setVisible: vi.fn().mockReturnThis(), play: vi.fn() };
        mockExplosionPool.get.mockReturnValue(explosion);

        manager.handlePlayerRammed(player, enemy);

        expect(player.disableBody).toHaveBeenCalled();
        expect(enemy.disableBody).toHaveBeenCalled();
        expect(mockRegistry.score).toBe(100);
        expect(mockScene.time.delayedCall).toHaveBeenCalled();
    });
});
