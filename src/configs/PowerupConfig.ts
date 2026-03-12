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
