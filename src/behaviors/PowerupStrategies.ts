import { IPowerupSprite, IPowerupEffectStrategy } from "./IPowerupBehavior";
import { Play } from "../scenes/Play";
import { Powerup } from "../prefabs/Powerup";
import { WeaponMode } from "../utils/GameRegistry";


// --- Sprite Strategies ---

export class HpSprite implements IPowerupSprite {
  getTexture(_scene: Play): string {
    return "powerup_hp";
  }
}

export class WeaponSprite implements IPowerupSprite {
  getTexture(scene: Play): string {
    const currentMode = scene.registryHelper.weaponMode;
    // The original logic returns 'powerup_weapon2' for SINGLE mode, and 'powerup_weapon3' otherwise.
    return currentMode === WeaponMode.SINGLE
      ? "powerup_weapon2"
      : "powerup_weapon3";
  }
}

// --- Effect Strategies ---

export class HpEffectStrategy implements IPowerupEffectStrategy {
  apply(_powerup: Powerup, scene: Play): void {
    const playerHealth = scene.registryHelper.health;
    scene.registryHelper.health = Math.min(10, playerHealth + 5);
  }
}

export class WeaponEffectStrategy implements IPowerupEffectStrategy {
  private WEAPON_POWERUP_LIMIT = 500; // Define as a constant if used elsewhere

  apply(_powerup: Powerup, scene: Play): void {
    const registry = scene.registryHelper;

    if (registry.powerupShots < registry.shotsFired) {
      registry.powerupShots = registry.shotsFired;
    }
    if (registry.weaponMode < WeaponMode.TRIPLE) {
      registry.weaponMode++;
    }
    registry.powerupShots += this.WEAPON_POWERUP_LIMIT;

    if (registry.playSound) {
      scene.sound.play("powerup");
    }
  }
}
