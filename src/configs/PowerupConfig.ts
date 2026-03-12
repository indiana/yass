import {
  IPowerupSprite,
  IPowerupEffectStrategy,
} from "../behaviors/IPowerupBehavior";
import {
  HpSprite,
  WeaponSprite,
  HpEffectStrategy,
  WeaponEffectStrategy,
} from "../behaviors/PowerupStrategies";
import Phaser from "phaser";

export interface PowerupConfig {
  type: string;
  sprite: IPowerupSprite;
  effectStrategy: IPowerupEffectStrategy;
}

export const PowerupTypes: Record<string, PowerupConfig> = {
  health: {
    type: "health",
    sprite: new HpSprite(),
    effectStrategy: new HpEffectStrategy(),
  },
  weapon: {
    type: "weapon",
    sprite: new WeaponSprite(),
    effectStrategy: new WeaponEffectStrategy(),
  },
};

export const DEFAULT_POWERUP_TYPE = "health";

// --- Weighted Spawning Logic ---

interface SpawnablePowerup {
  type: string;
  weight: number;
}

const PowerupSpawnConfig: SpawnablePowerup[] = [
  { type: "weapon", weight: 1 }, // 50% chance
  { type: "health", weight: 1 }, // 50% chance
];

const totalWeight = PowerupSpawnConfig.reduce(
  (sum, powerup) => sum + powerup.weight,
  0,
);

/**
 * Selects a random power-up type based on the weights defined in PowerupSpawnConfig.
 * @returns The key of the power-up type (e.g., 'health', 'weapon').
 */
export function getRandomPowerupType(): string {
  if (totalWeight === 0) return DEFAULT_POWERUP_TYPE;

  let randomWeight = Phaser.Math.FloatBetween(0, totalWeight);
  for (const spawnable of PowerupSpawnConfig) {
    randomWeight -= spawnable.weight;
    if (randomWeight <= 0) {
      return spawnable.type;
    }
  }

  return DEFAULT_POWERUP_TYPE; // Failsafe
}
