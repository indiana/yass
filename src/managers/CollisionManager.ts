import Phaser from "phaser";
import { GameRegistry } from "../utils/GameRegistry";
import { PowerupSpawner } from "./PowerupSpawner";
import { GameConstants } from "../configs/GameConstants";
import { Enemy } from "../prefabs/Enemy";
import { Player } from "../prefabs/Player";
import { Bullet } from "../prefabs/Bullet";
import { Powerup } from "../prefabs/Powerup";
import { Explosion } from "../prefabs/Explosion";
import { Play } from "../scenes/Play";

export interface ICollisionManagerContext {
  scene: Phaser.Scene;
  registry: GameRegistry;
  powerupSpawner: PowerupSpawner;
  explosionPool: Phaser.GameObjects.Group;
  enemyPool: Phaser.Physics.Arcade.Group;
}

export class CollisionManager {
  constructor(private context: ICollisionManagerContext) {}

  public handleEnemyHit(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const bullet = obj1 as Bullet;
    const enemy = obj2 as Enemy;
    bullet.disableBody(true, true);
    if (enemy.damage(GameConstants.ENEMY.DAMAGE_ON_HIT)) {
      this.enemyDown(enemy);
    }
  }

  public handlePlayerHit(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const player = obj1 as Player;
    const bullet = obj2 as Bullet;
    this.context.registry.health -=
      (bullet.getData("damage") as number) ||
      GameConstants.PLAYER.DAMAGE_ON_HIT;
    bullet.disableBody(true, true);

    if (this.context.registry.health <= 0) {
      this.playerDown(player);
    } else {
      this.context.scene.tweens.add({
        targets: player,
        alpha: 0.1,
        duration: 100,
        yoyo: true,
        repeat: 5,
      });
    }
  }

  public handlePlayerRammed(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const player = obj1 as Player;
    const enemy = obj2 as Enemy;
    this.enemyDown(enemy);
    this.playerDown(player);
  }

  public handleCollectPowerup(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const powerup = obj2 as Powerup;
    // We need to pass the scene because Powerup strategies expect it.
    // In the future, we should decouple Powerup strategies from the Scene.
    powerup.applyEffect(this.context.scene as Play);
    powerup.disableBody(true, true);
  }

  private enemyDown(enemy: Enemy) {
    enemy.disableBody(true, true);
    this.explode(enemy.x, enemy.y);
    this.context.registry.score += enemy.config.score;
    this.context.powerupSpawner.trySpawnPowerup(
      enemy.x,
      enemy.y,
      enemy.config.powerupChance || 0
    );
  }

  private playerDown(player: Player) {
    player.disableBody(true, true);
    this.explode(player.x, player.y);
    this.context.scene.scene.stop("UIScene");
    if (this.context.scene.scene.isActive("PauseScene")) {
      this.context.scene.scene.stop("PauseScene");
    }
    this.context.scene.time.delayedCall(1000, () =>
      this.context.scene.scene.start("GameOver")
    );
  }

  private explode(x: number, y: number) {
    const explosion = this.context.explosionPool.get(x, y) as Explosion;
    if (explosion) {
      explosion.setActive(true).setVisible(true);
      explosion.play("explode");
      if (this.context.registry.playSound) {
        this.context.scene.sound.play("enemy_explode");
      }
    }
  }
}
