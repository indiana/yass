import { describe, it, expect, vi } from 'vitest';
import { Explosion } from '../../src/prefabs/Explosion';
import Phaser from 'phaser';

// Mock Phaser completely to avoid DOM/Canvas issues
vi.mock('phaser', () => {
    class MockSprite {
        scene: unknown;
        active: boolean = true;
        visible: boolean = true;
        _listeners: Record<string, () => void> = {};

        constructor(scene: unknown, _x: number, _y: number, _texture: string) {
            this.scene = scene;
        }

        on(event: string, fn: () => void) {
            this._listeners[event] = fn;
            return this;
        }

        emit(event: string) {
            if (this._listeners[event]) {
                this._listeners[event]();
            }
        }

        setActive(value: boolean) {
            this.active = value;
            return this;
        }

        setVisible(value: boolean) {
            this.visible = value;
            return this;
        }
    }

    return {
        default: {
            GameObjects: {
                Sprite: MockSprite
            },
            Scene: class {}
        }
    };
});

interface ExplosionWithMocks extends Explosion {
    active: boolean;
    visible: boolean;
}

describe('Explosion Prefab', () => {
    it('should deactivate and hide itself on animation complete', () => {
        const mockScene = {
            add: { existing: vi.fn() }
        } as unknown as Phaser.Scene;

        const explosion = new Explosion(mockScene, 0, 0) as unknown as ExplosionWithMocks;

        // Verify initial state (mock defaults)
        expect(explosion.active).toBe(true);
        expect(explosion.visible).toBe(true);

        // Trigger animation complete
        explosion.emit('animationcomplete');

        // Verify state changed
        expect(explosion.active).toBe(false);
        expect(explosion.visible).toBe(false);
    });
});
