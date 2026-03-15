import { SpawningConfiguration } from "../configs/SpawningConfig";
import { DEFAULT_ENEMY_TYPE } from "../configs/EnemyConfig";
import { GameConstants } from "../configs/GameConstants";

export interface IWaveContext {
  enemiesSpawned: number;
  spawnEnemy: (type: string) => void;
  getRandom: (min: number, max: number) => number;
}

export class WaveManager {
  private lastSpawnTime = 0;

  public update(time: number, context: IWaveContext): void {
    // Basic spawning logic
    const spawnChance = 500 - Math.min(context.enemiesSpawned, 400);
    if (context.getRandom(1, spawnChance) <= 10) {
      const type = this.selectEnemyType(context.enemiesSpawned);
      context.spawnEnemy(type);
    }
  }

  private selectEnemyType(enemiesSpawned: number): string {
    let currentSpawnStage = SpawningConfiguration[0];

    // Find the correct spawn stage based on the number of enemies spawned
    for (let i = SpawningConfiguration.length - 1; i >= 0; i--) {
      const stage = SpawningConfiguration[i];
      if (enemiesSpawned >= stage.minEnemiesSpawned) {
        currentSpawnStage = stage;
        break;
      }
    }

    // Calculate the total weight of the current spawn pool
    const totalWeight = currentSpawnStage.spawnPool.reduce(
      (sum, enemy) => sum + enemy.weight,
      0
    );
    if (totalWeight === 0) return DEFAULT_ENEMY_TYPE; // Failsafe

    // Pick a random number and find the corresponding enemy type
    let randomWeight = Math.random() * totalWeight;
    for (const spawnable of currentSpawnStage.spawnPool) {
      randomWeight -= spawnable.weight;
      if (randomWeight <= 0) {
        return spawnable.type;
      }
    }

    return DEFAULT_ENEMY_TYPE;
  }
}
