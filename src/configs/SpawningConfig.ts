// This defines one enemy's chance within a stage
interface SpawnableEnemy {
    type: string; // 'grunt', 'scout', etc.
    weight: number;
}

// This defines a list of enemies that can spawn at a certain game stage
interface SpawnStage {
    minEnemiesSpawned: number;
    spawnPool: SpawnableEnemy[];
}

// This configuration replaces the hardcoded if/else logic for spawning.
// The spawner will find the correct stage based on `enemiesSpawned` and then
// use the weights to randomly select an enemy from the `spawnPool`.
export const SpawningConfiguration: SpawnStage[] = [
    // Stage 0: From the beginning of the game (levelBonus = 0)
    {
        minEnemiesSpawned: 0,
        spawnPool: [
            { type: 'heavyGrunt', weight: 1 }, // rand <= 1
            { type: 'kamikaze', weight: 1 },   // rand <= 2
            { type: 'scout', weight: 3 },      // rand <= 5
            { type: 'grunt', weight: 5 }       // rand > 5
        ]
    },
    // Stage 1: After 100 enemies are spawned (levelBonus = 1)
    {
        minEnemiesSpawned: 100,
        spawnPool: [
            { type: 'heavyGrunt', weight: 2 }, // rand <= 2
            { type: 'kamikaze', weight: 1 },   // rand <= 3
            { type: 'scout', weight: 2 },      // rand <= 5
            { type: 'grunt', weight: 5 }       // rand > 5
        ]
    },
    // Stage 2: After 200 enemies are spawned (levelBonus = 2)
    {
        minEnemiesSpawned: 200,
        spawnPool: [
            { type: 'heavyGrunt', weight: 3 }, // rand <= 3
            { type: 'kamikaze', weight: 1 },   // rand <= 4
            { type: 'scout', weight: 1 },      // rand <= 5
            { type: 'grunt', weight: 5 }       // rand > 5
        ]
    },
    // Stage 3: After 300 enemies are spawned (levelBonus = 3)
    {
        minEnemiesSpawned: 300,
        spawnPool: [
            { type: 'heavyGrunt', weight: 4 }, // rand <= 4
            { type: 'kamikaze', weight: 1 },   // rand <= 5
            { type: 'scout', weight: 0 },      // Scouts no longer spawn naturally
            { type: 'grunt', weight: 5 }       // rand > 5
        ]
    },
    // Stage 4: After 400 enemies are spawned (levelBonus = 4)
    {
        minEnemiesSpawned: 400,
        spawnPool: [
            { type: 'heavyGrunt', weight: 5 }, // rand <= 5
            { type: 'kamikaze', weight: 0 },   // Kamikazes no longer spawn
            { type: 'scout', weight: 0 },
            { type: 'grunt', weight: 5 }
        ]
    },
    // Stage 5: After 500 enemies are spawned (levelBonus = 5, max)
    {
        minEnemiesSpawned: 500,
        spawnPool: [
            { type: 'heavyGrunt', weight: 6 }, // rand <= 6
            { type: 'kamikaze', weight: 0 },
            { type: 'scout', weight: 0 },
            { type: 'grunt', weight: 4 }
        ]
    }
];
