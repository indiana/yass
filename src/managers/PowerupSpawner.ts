// src/managers/PowerupSpawner.ts
import { PowerupTypes, DEFAULT_POWERUP_TYPE, getRandomPowerupType } from '../configs/PowerupConfig';
import { IPowerupSpawnerContext } from '../interfaces/IGameEntities';

export class PowerupSpawner {
    private context: IPowerupSpawnerContext;

    constructor(context: IPowerupSpawnerContext) {
        this.context = context;
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

        if (this.context.getRandom(1, 100) <= chance) {
            const powerup = this.context.getPowerup();
            if (!powerup) return; // Pool might be empty

            const typeKey = getRandomPowerupType();
            const config = PowerupTypes[typeKey] || PowerupTypes[DEFAULT_POWERUP_TYPE];

            powerup.spawn(config, x, y);
        }
    }
}
