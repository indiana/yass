import { describe, it, expect, vi } from 'vitest';
import { Explosion } from '../../src/prefabs/Explosion';

// Mock Phaser completely to avoid DOM/Canvas issues
vi.mock('phaser', () => {
    class MockSprite {
        scene: any;
        active: boolean = true;
        visible: boolean = true;
        _listeners: Record<string, Function> = {};

        constructor(scene: any, x: number, y: number, texture: string) {
            this.scene = scene;
        }

        on(event: string, fn: Function) {
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

describe('Explosion Prefab', () => {
    it('should deactivate and hide itself on animation complete', () => {
        const mockScene = {
            add: { existing: vi.fn() }
        };

        const explosion = new Explosion(mockScene as any, 0, 0);

        // Verify initial state (mock defaults)
        expect((explosion as any).active).toBe(true);
        expect((explosion as any).visible).toBe(true);

        // Trigger animation complete
        (explosion as any).emit('animationcomplete');

        // Verify state changed
        expect((explosion as any).active).toBe(false);
        expect((explosion as any).visible).toBe(false);
    });
});
