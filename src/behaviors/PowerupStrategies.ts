import { IPowerupSprite, IPowerupEffectStrategy } from "./IPowerupBehavior";
import { Play } from "../scenes/Play";
import { Powerup } from "../prefabs/Powerup";
import { WeaponMode } from "../utils/GameRegistry";
import { GameConstants } from "../configs/GameConstants";


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
    scene.registryHelper.healPlayer(5);
  }
}

export class WeaponEffectStrategy implements IPowerupEffectStrategy {

  apply(_powerup: Powerup, scene: Play): void {
    const registry = scene.registryHelper;

    if (registry.powerupShots < registry.shotsFired) {
      registry.setPowerupShots(registry.shotsFired);
    }
    
    registry.upgradeWeapon();
    registry.addPowerupShots(GameConstants.WEAPON_POWERUP_LIMIT);

    if (registry.playSound) {
      scene.sound.play("powerup");
    }
  }
}
