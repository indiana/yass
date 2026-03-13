# TDD Adoption Summary

## Completed Tasks
1.  **Tooling Setup:**
    -   Installed `vitest` and `happy-dom`.
    -   Configured `vitest.config.ts`.
    -   Added `test` script to `package.json`.
    -   Updated `tsconfig.json` to include tests and vitest types.

2.  **Core Game Logic Coverage:**
    -   **Utilities:** `tests/utils/GameRegistry.test.ts` (100% logic coverage).
    -   **Movement:** `tests/behaviors/Movement.test.ts` (SineWave, PlayerTracking).
    -   **Shooting:** `tests/behaviors/Shooting.test.ts` (ProbabilisticShooting).
    -   **Powerups:** `tests/managers/PowerupSpawner.test.ts` (Spawn chance and type selection).
    -   **Explosions:** `tests/prefabs/Explosion.test.ts` (Self-deactivation and pool recycling logic).
    -   **Configs:** `tests/configs/EnemyConfig.test.ts` and `tests/configs/SpawningConfig.test.ts` (Data integrity and stage ordering).

3.  **Refactoring & Architecture:**
    -   **Decoupling:** Introduced domain interfaces (`IMovable`, `IGameContext`, `IPowerup`, etc.) in `src/interfaces/IGameEntities.ts` to isolate game logic from the Phaser engine.
    -   **Domain Implementation:** Updated `Enemy` and `Powerup` prefabs to implement these interfaces.
    -   **Encapsulation:** Refactored `PowerupSpawner` and `Shooting` strategies to operate against abstract contexts.
    -   **Self-Management:** Implemented a dedicated `Explosion` prefab to manage its own lifecycle and deactivation.

## How to Run Tests
-   Run all tests: `npm test`
-   Watch mode: `npm test -- --watch`

## Next Steps
-   **Integration Testing**: Explore scene-level integration tests using a mocked Phaser environment.
-   **Player Logic**: Refactor `Player.ts` to use a behavior-based approach (similar to Enemies) to unit test movement and shooting patterns.
-   **UI & State**: Add tests for `GameRegistry` events and their impact on `UIScene` display.
