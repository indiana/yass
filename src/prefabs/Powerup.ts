import Phaser from "phaser";
import { PowerupConfig } from "../configs/PowerupConfig";
import { IPowerupEffectStrategy } from "../behaviors/IPowerupBehavior";
import { Play } from "../scenes/Play";
import { IPowerup } from "../interfaces/IGameEntities";

export class Powerup extends Phaser.Physics.Arcade.Sprite implements IPowerup {
  private effectStrategy!: IPowerupEffectStrategy;
  public config!: PowerupConfig; // Public for debugging if needed

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "powerup_hp"); // Default texture
    scene.add.existing(this);

    this.setOrigin(0.5, 0.5);
  }

  public spawn(config: PowerupConfig, x: number, y: number) {
    this.config = config;
    this.effectStrategy = config.effectStrategy;

    this.setTexture(config.sprite.getTexture(this.scene as Play));
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(150);
  }

  /* eslint-disable prefer-spread */
  public applyEffect(scene: Play) {
    this.effectStrategy.apply(this, scene);
  }
  /* eslint-enable prefer-spread */

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.y > 650) {
      this.disableBody(true, true);
    }
  }
}
