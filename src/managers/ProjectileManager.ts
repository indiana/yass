import Phaser from "phaser";
import { IProjectileManager } from "../interfaces/IGameEntities";
import { Bullet } from "../prefabs/Bullet";
import { GameRegistry } from "../utils/GameRegistry";

export class ProjectileManager implements IProjectileManager {
  constructor(
    private scene: Phaser.Scene,
    private registry: GameRegistry,
    private playerBulletPool: Phaser.Physics.Arcade.Group,
    private enemyBulletPool: Phaser.Physics.Arcade.Group
  ) {}

  public fire(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    damage: number,
    isPlayer: boolean
  ): void {
    const pool = isPlayer ? this.playerBulletPool : this.enemyBulletPool;
    const bullet = pool.get() as Bullet;

    if (bullet) {
      bullet.fire(x, y, velocityX, velocityY);
      bullet.setData("damage", damage);

      if (this.registry.playSound) {
        const soundKey = isPlayer ? "player_shot" : "enemy_shot";
        this.scene.sound.play(soundKey);
      }
    }
  }
}
