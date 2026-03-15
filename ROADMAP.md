# YASS Project Maturity & Roadmap

## Current Maturity Assessment
The project has successfully migrated from a legacy Phaser 2 architecture to a modern, TDD-driven Phaser 3/TypeScript environment. The use of **Strategy patterns** for enemy behaviors and **Domain-Driven interfaces** to decouple game logic from the Phaser engine are signs of high architectural maturity.

---

## Weak Points & Improvement Strategies

### 1. Player Logic Monolith
*   **Weak Point:** Unlike the enemies, `Player.ts` is a "legacy-style" prefab where input handling, movement, and shooting are all tightly coupled within the class. This prevents unit testing of player mechanics.
*   **Improvement:** Refactor `Player.ts` to use a behavior-based approach. Introduce `IPlayerMovementStrategy` and `IPlayerShootingStrategy`. This will allow testing player movement and weapon modes in isolation using Vitest.

### 2. Scene Over-Responsibility (`Play.ts`)
*   **Weak Point:** `Play.ts` is starting to suffer from "God Object" syndrome. It handles pool initialization, collision setup, spawning policies, and specific logic like `enemyShoot`.
*   **Improvement:** 
    *   **Collision Manager:** Extract collision handlers into a dedicated manager.
    *   **Wave Manager:** Move the "when and what to spawn" logic (spawning policy) into a separate manager, leaving only the "how to spawn" (mechanism) in the scene.
    *   **Configuration:** Centralize hardcoded constants (e.g., `SHOT_DELAY`, `MAX_SPEED`) into a `configs/GameConstants.ts` file.

### 3. Type Safety Gaps (`any` usage)
*   **Weak Point:** There are multiple instances of `any` in collision handlers (`enemyHit`, `playerHit`, etc.), which bypasses TypeScript's type-checking and makes the code more fragile during refactoring.
*   **Improvement:** Replace `any` with explicit types or common interfaces (e.g., `IEntity`). Leverage Phaser's generic types for Groups and Colliders.

### 4. Logic Leakage
*   **Weak Point:** The `enemyShoot` method still resides in the `Play` scene. Even though enemies have a `ShootingStrategy`, they have to "call back" to the scene to actually fire a bullet.
*   **Improvement:** Fully encapsulate behaviors. A `ShootingStrategy` should interact with a `ProjectileManager` or `BulletPool` directly (via an interface) rather than relying on the scene to mediate the action.

### 5. State Management Fragmentation
*   **Weak Point:** Game state (score, health, weapon mode) is accessed inconsistently via `GameRegistry`, scene properties, and Phaser's internal registry (string-based lookups).
*   **Improvement:** Standardize `GameRegistry` as the single source of truth. Ensure all state changes go through typed methods in the registry to prevent "magic string" bugs.

---

## Prioritized Roadmap

### Phase 1: Immediate (Logic Parity) [DONE]
1.  [x] Refactor `Player.ts` to use the Strategy pattern to achieve 100% logic testability.
2.  [x] Align player and enemy behavior architectures for consistency.

### Phase 2: Short-term (Scene Refactoring) [DONE]
1.  [x] Extract a `CollisionManager` to reduce the size and complexity of `Play.ts`.
2.  [x] Create `configs/GameConstants.ts` to remove hardcoded values from classes.

### Phase 3: Medium-term (Technical Excellence)
1.  Audit and remove all `any` types to ensure full TypeScript coverage.
2.  Standardize `GameRegistry` for all game state interactions.

### Phase 4: Long-term (Feature Scaling)
1.  Implement a `WaveManager` to allow for more complex difficulty scaling and level progression.
2.  Encapsulate projectile management to remove "callbacks" to the scene from behavior strategies.

### Phase 5: Procedural Background Generation
- Implement a dynamic, procedurally generated parallax background with stars and cosmic objects.
- Explore and implement generation algorithms for star fields and nebulae.
- Layer generated elements to create depth and parallax effect.
