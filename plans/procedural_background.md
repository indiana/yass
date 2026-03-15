# Implementation Plan: Procedural Parallax Background

## Objective
Replace the current static, tiled background with a dynamic, procedurally generated parallax background featuring stars and cosmic objects.

## Context
- **Current Background:** Uses three `TileSprite` layers (`bg100`, `bg80`, `bg60`) with fixed vertical scrolling speeds in `src/prefabs/Background.ts`.
- **Target Assets:** Stars, nebulae, and other cosmic objects generated at runtime.
- **Goal:** Create a visually rich, dynamic, and unique background that adds depth and aesthetic appeal to the game.

## Research & Design (Phase 1)

1.  **Phaser 3 Texture Generation:**
    *   Utilize `scene.textures.generate()` or `Phaser.GameObjects.Graphics` drawn to a `RenderTexture`.
    *   Each layer (e.g., distant stars, mid-ground nebulae, closer stars) will be its own generated texture.
2.  **Algorithms for Generation:**
    *   **Star Fields:** Random distribution with varying size (1-3px) and alpha (0.2-1.0) to create depth.
    *   **Nebulae:** Multi-layered soft particles with additive blending to create smooth, organic clouds.
3.  **Parallax Strategy:**
    *   3-4 layers of `Phaser.GameObjects.TileSprite`.
    *   Speeds scale proportionally to the "distance" of the layer.
4.  **Performance & Cleanup:**
    *   Textures are generated once during the `create()` phase of the background prefab.
    *   Generated textures must be explicitly destroyed in `destroy()` to prevent memory leaks during scene restarts.

## Implementation Steps (Phase 2)

### 1. Update `src/configs/GameConstants.ts`
*   Add a `BACKGROUND` section for:
    *   `STAR_LAYERS`: Configuration for each layer (count, size range, alpha range).
    *   `NEBULA_LAYERS`: Configuration for nebula elements (count, color, alpha).
    *   `SCROLL_SPEED_BASE`: Initial scrolling speed.

### 2. Implement Generators (TDD)
*   Create `src/utils/BackgroundGenerator.ts`: Contains `StarGenerator` and `NebulaGenerator`.
*   **Seamless Tiling:** Implemented via wraparound drawing (drawing objects on opposite sides when near edges).
*   **Aesthetics:** `NebulaGenerator` uses clusters of soft, multi-layered circles with `ADD` blend mode for smooth, fuzzy overlaps.
*   **Test:** Created `tests/utils/BackgroundGenerator.test.ts` to verify generation counts and texture creation.

### 3. Create `src/prefabs/ProceduralBackground.ts`
*   Replaces `Background.ts`.
*   In `constructor()`:
    *   Calls generators to create textures.
    *   Initializes `TileSprite` layers.
*   In `preUpdate()`:
    *   Updates `tilePositionY` for each layer.
    *   **Dynamic Scaling:** Reads `registryHelper.enemiesSpawned` to scale scroll speed as the game progresses.
*   In `destroy()`:
    *   Cleans up generated textures from `scene.textures`.

### 4. Integration into `Play.ts`
*   Updates `Play.ts` to instantiate `ProceduralBackground`.

## Verification
- **Unit Tests:** `npm test` passes for new generators.
- **Visual:** Smooth scrolling, perfect seamless tiling, varied cloud-like nebula patterns with soft edges.
- **Performance:** Monitored FPS; generation is fast and cleanup is handled.
