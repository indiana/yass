# Phase 3: Technical Excellence Plan

## Objective
Improve code quality, type safety, and state management consistency by:
1.  Removing `any` types and replacing them with strict interfaces.
2.  Standardizing `GameRegistry` usage to eliminate direct property access and "magic strings".

## Analysis

### 1. `any` Usage Audit
We need to identify where `any` is currently used. Based on previous work, likely candidates are:
- `CollisionManager.ts`: The `handle...` methods currently accept `Phaser.GameObjects.GameObject`, but often cast to specific types or use `any` implicitly in tests.
- `Play.ts`: Event listeners or callbacks might still have loose typing.
- `GameRegistry.ts`: Ensure it doesn't expose `any`.

### 2. GameRegistry Standardization
The `GameRegistry` class currently mixes public properties (e.g., `score`, `health`) with some helper methods.
- **Problem:** Code can modify `registry.score` directly, bypassing potential logic (e.g., validating score >= 0, triggering UI updates).
- **Goal:** Encapsulate state behind getter/setter methods or specific action methods (e.g., `addScore(amount: number)`, `damagePlayer(amount: number)`).

## Proposed Architecture

### A. Strict Typing
Introduce shared interfaces in `src/interfaces/IGameEntities.ts` (or similar) to define common properties for collidable objects.

```typescript
// src/interfaces/ICollidable.ts
export interface ICollidable extends Phaser.GameObjects.GameObject {
    damage?(amount: number): boolean; // Returns true if destroyed
    disableBody?(disableDeactivate: boolean, disableHide: boolean): void;
    // ... other common physics properties
}
```

### B. GameRegistry Refactoring
Refactor `GameRegistry` to be a robust state manager.

```typescript
export class GameRegistry {
    private _score: number = 0;
    private _health: number = 10;
    // ...

    public get score(): number { return this._score; }
    public addScore(amount: number): void {
        this._score += amount;
        this.events.emit('scoreChanged', this._score); // Optional: Event-driven UI updates
    }

    public get health(): number { return this._health; }
    public damagePlayer(amount: number): void {
        this._health = Math.max(0, this._health - amount);
    }
    // ...
}
```

## Implementation Steps

### Step 1: Type Audit & Cleanup
1.  Search for `any` in `src/**/*.ts`.
2.  Create/Update interfaces in `src/interfaces/` to cover the identified gaps.
3.  Update function signatures to use these interfaces.
4.  Fix any resulting type errors.

### Step 2: GameRegistry Refactoring
1.  Modify `src/utils/GameRegistry.ts` to encapsulate properties.
2.  Add methods for state mutation (`addScore`, `setWeaponMode`, etc.).
3.  Update all references (Ctrl+Shift+F is your friend) to use the new methods.
    - `Play.ts`
    - `CollisionManager.ts`
    - `UIScene.ts` (likely reads values for display)
    - Strategies

### Step 3: Verification
1.  **Linting:** `npm run lint` should report zero `no-explicit-any` warnings (if the rule is enabled).
2.  **Testing:** Run `npm test`. Unit tests for `GameRegistry` and `CollisionManager` will need updates to match the new API.
3.  **Manual Test:** Verify the UI updates correctly (Score, Health) and game flow works.

## Risks & Mitigation
- **Risk:** Breaking UI updates if `GameRegistry` changes how data is accessed.
- **Mitigation:** Check `UIScene.ts` carefully. If it polls values in `update()`, getters will work fine. If it uses events, we might need to add an event emitter to `GameRegistry`.
