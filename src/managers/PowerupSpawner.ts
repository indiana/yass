// src/managers/PowerupSpawner.ts
import Phaser from "phaser";
import { Play } from "../scenes/Play";
import { Powerup } from "../prefabs/Powerup";
import { PowerupTypes, DEFAULT_POWERUP_TYPE, getRandomPowerupType } from '../configs/PowerupConfig';

export class PowerupSpawner {
    private scene: Play;

    constructor(scene: Play) {
        this.scene = scene;
    }

    /**
     * Attempts to spawn a powerup at the given coordinates based on the provided chance.
     * @param x X-coordinate for powerup spawn.
     * @param y Y-coordinate for powerup spawn.
     * @param enemyPowerupChance The percentage chance (0-100) for a powerup to spawn.
     */
    public trySpawnPowerup(x: number, y: number, enemyPowerupChance: number): void {
        // Ensure enemyPowerupChance is a valid number, default to 0 if undefined/null
        const chance = enemyPowerupChance || 0;

        if (Phaser.Math.Between(1, 100) <= chance) {
            const powerup = this.scene.powerupPool.get() as Powerup;
            if (!powerup) return; // Pool might be empty

            const typeKey = getRandomPowerupType();
            const config = PowerupTypes[typeKey] || PowerupTypes[DEFAULT_POWERUP_TYPE];

            powerup.spawn(config, x, y);
        }
    }
}
