import { Play } from "../scenes/Play";
import { Powerup } from "../prefabs/Powerup";

// Interface for determining the power-up's visual texture
export interface IPowerupSprite {
  getTexture(scene: Play): string;
}

// Interface for applying the power-up's effect
export interface IPowerupEffectStrategy {
  apply(powerup: Powerup, scene: Play): void;
}
