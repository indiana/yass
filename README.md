# YASS - Yet Another Space Shooter

A classic vertical-scrolling shoot-'em-up game built with modern web technologies. Blast your way through endless waves of enemies, collect power-ups, and aim for the high score!

![YASS Logo](public/starship2.png)

## Gameplay

The goal is to survive as long as possible while destroying enemy ships. The game's difficulty increases over time, with enemies becoming faster, more numerous, and more aggressive.

### Controls

*   **Move:** `Left Arrow` / `Right Arrow`
*   **Shoot:** `Spacebar` or `Mouse Click`
*   **Pause:** `P`
*   **Toggle Sound:** `S`

### Power-ups

Occasionally, destroyed enemies will drop a power-up.
*   **Weapon Upgrade:** Increases your weapon from a single to a double, and finally to a triple-shot cannon. The effect is temporary.
*   **Health Pack:** Restores a portion of your ship's health.

### Enemies

*   **Grunt:** The standard enemy fighter.
*   **Heavy Grunt:** A tougher version of the Grunt with more health.
*   **Scout:** A fast but fragile ship that moves in an evasive sine-wave pattern.
*   **Kamikaze:** A very fast, non-shooting ship that attempts to ram the player.

## Tech Stack & Architecture

This project is built using [Phaser 3](https://phaser.io/) and [TypeScript](https://www.typescriptlang.org/), compiled and served with [Vite](https://vitejs.dev/).

It features a modular, data-driven architecture to make extending the game easy:

*   **Strategy Pattern:** Enemy behaviors (movement, shooting) are not hardcoded. Instead, they are defined as interchangeable "strategy" classes, which are assigned to enemy types in a configuration file (`src/configs/EnemyConfig.ts`).
*   **Staged, Weighted Spawning:** Enemy spawns are controlled by a configuration file (`src/configs/SpawningConfig.ts`) that defines different "stages" of the game. Each stage has its own pool of enemies with different spawn probabilities (weights), allowing for a designed difficulty curve.
*   **Component-like Prefabs:** Game entities like `Player` and `Enemy` are encapsulated in their own classes, managing their own logic.
*   **Scene Separation:** The UI (`UIScene`) runs as a separate, parallel scene to the main gameplay (`Play`), keeping rendering and logic concerns cleanly separated.

## Getting Started

To run the project locally, you'll need [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/indiana/yass.git
    cd yass
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The game will be available at `http://localhost:5173` (or the next available port).
