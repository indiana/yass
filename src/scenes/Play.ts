import Phaser from "phaser";
import { Background } from "../prefabs/Background";
import { Bullet } from "../prefabs/Bullet";
import { Enemy } from "../prefabs/Enemy";
import { Explosion } from "../prefabs/Explosion";
import { Powerup } from "../prefabs/Powerup";
import { Player } from "../prefabs/Player";
import { GameRegistry, WeaponMode } from "../utils/GameRegistry";
import { SpawningConfiguration } from "../configs/SpawningConfig";
import { EnemyTypes, DEFAULT_ENEMY_TYPE } from "../configs/EnemyConfig";
import { PowerupSpawner } from "../managers/PowerupSpawner";
import { IPowerupSpawnerContext } from "../interfaces/IGameEntities";

export class Play extends Phaser.Scene {
    private SHOT_DELAY = 100;
    private NUMBER_OF_EXPLOSIONS = 20;
    private WEAPON_POWERUP_LIMIT = 500;

  public player!: Player; // Public for strategies
  private background!: Background;
  private playerBulletPool!: Phaser.Physics.Arcade.Group;
  private enemyBulletPool!: Phaser.Physics.Arcade.Group;
  private enemyPool!: Phaser.Physics.Arcade.Group;
  private powerupPool!: Phaser.Physics.Arcade.Group;
  private explosionPool!: Phaser.GameObjects.Group;

  public registryHelper!: GameRegistry; // Public for strategies
  private lastEnemyBulletShotAt = 0;
  private sKey!: Phaser.Input.Keyboard.Key;
  private pKey!: Phaser.Input.Keyboard.Key;

  private currentSpawnStage = SpawningConfiguration[0];
  private powerupSpawner!: PowerupSpawner;

  constructor() {
    super("Play");
  }

  create() {
    const { width } = this.cameras.main;
    this.registryHelper = new GameRegistry(this);
    this.registryHelper.reset();

    this.background = new Background(this);

    this.playerBulletPool = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.enemyBulletPool = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.enemyPool = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    this.powerupPool = this.physics.add.group({
      classType: Powerup,
      runChildUpdate: true,
    });
    this.explosionPool = this.add.group({
      classType: Explosion,
      defaultKey: "explosion",
      maxSize: this.NUMBER_OF_EXPLOSIONS,
      runChildUpdate: true,
    });

    this.player = new Player(this, width / 2, 550, this.playerBulletPool);

    const spawnerContext: IPowerupSpawnerContext = {
      getPowerup: () => this.powerupPool.get() as Powerup,
      getRandom: Phaser.Math.Between
    };
    this.powerupSpawner = new PowerupSpawner(spawnerContext);

    this.scene.launch("UIScene");

    this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.pKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this.physics.add.overlap(
      this.playerBulletPool,
      this.enemyPool,
      this.enemyHit,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.enemyBulletPool,
      this.player,
      this.playerHit,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.enemyPool,
      this.player,
      this.playerRammed,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.powerupPool,
      this.player,
      this.collectPowerup,
      undefined,
      this,
    );

    this.spawnEnemy();
  }

  update(_time: number) {
    if (Phaser.Input.Keyboard.JustDown(this.sKey))
      this.registryHelper.playSound = !this.registryHelper.playSound;
    if (Phaser.Input.Keyboard.JustDown(this.pKey)) this.pauseGame();

    // Spawn logic
    if (
      Phaser.Math.Between(
        1,
        500 - Math.min(this.registryHelper.enemiesSpawned, 400),
      ) <= 10
    ) {
      this.spawnEnemy();
    }

    // Weapon mode degradation
    if (
      this.registryHelper.weaponMode > WeaponMode.SINGLE &&
      this.registryHelper.powerupShots <= this.registryHelper.shotsFired
    ) {
      this.registryHelper.weaponMode--;
      this.registryHelper.powerupShots =
        this.registryHelper.shotsFired + this.WEAPON_POWERUP_LIMIT;
    }
  }

  public enemyShoot(enemy: Enemy, time: number) {
    if (time - this.lastEnemyBulletShotAt < this.SHOT_DELAY * 2) return;

    this.lastEnemyBulletShotAt = time;
    const bullet = this.enemyBulletPool.get() as Bullet;
    if (bullet) {
      const velocityY = Math.min(
        400 + Math.floor(this.registryHelper.enemiesSpawned / 50) * 50,
        800,
      );
      bullet.fire(enemy.x, enemy.y + 32, 0, velocityY);
      bullet.setData("damage", enemy.config.bullet?.damage || 1);
      if (this.registryHelper.playSound) this.sound.play("enemy_shot");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private enemyHit(obj1: any, obj2: any) {
    const bullet = obj1 as Bullet;
    const enemy = obj2 as Enemy;
    bullet.disableBody(true, true);
    if (enemy.damage(5)) {
      this.enemyDown(enemy);
    }
  }

  private enemyDown(enemy: Enemy) {
    enemy.disableBody(true, true);
    this.explode(enemy);
    this.registryHelper.score += enemy.config.score;
    this.powerupSpawner.trySpawnPowerup(enemy.x, enemy.y, enemy.config.powerupChance || 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private playerHit(obj1: any, obj2: any) {
    const player = obj1 as Player;
    const bullet = obj2 as Bullet;
    this.registryHelper.health -= bullet.getData("damage") || 1;
    bullet.disableBody(true, true);
    if (this.registryHelper.health <= 0) this.playerDown();
    else
      this.tweens.add({
        targets: player,
        alpha: 0.1,
        duration: 100,
        yoyo: true,
        repeat: 5,
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private playerRammed(obj1: any, obj2: any) {
    const enemy = obj2 as Enemy;
    this.enemyDown(enemy);
    this.playerDown();
  }

  private playerDown() {
    this.player.disableBody(true, true);
    this.explode(this.player);
    this.scene.stop("UIScene");
    if (this.scene.isActive("PauseScene")) this.scene.stop("PauseScene");
    this.time.delayedCall(1000, () => this.scene.start("GameOver"));
  }

  private selectEnemyType(): string {
    // Find the correct spawn stage based on the number of enemies spawned
    const enemiesSpawned = this.registryHelper.enemiesSpawned;
    for (let i = SpawningConfiguration.length - 1; i >= 0; i--) {
      const stage = SpawningConfiguration[i];
      if (enemiesSpawned >= stage.minEnemiesSpawned) {
        this.currentSpawnStage = stage;
        break;
      }
    }

    // Calculate the total weight of the current spawn pool
    const totalWeight = this.currentSpawnStage.spawnPool.reduce(
      (sum, enemy) => sum + enemy.weight,
      0,
    );
    if (totalWeight === 0) return DEFAULT_ENEMY_TYPE; // Failsafe

    // Pick a random number and find the corresponding enemy type
    let randomWeight = Phaser.Math.FloatBetween(0, totalWeight);
    for (const spawnable of this.currentSpawnStage.spawnPool) {
      randomWeight -= spawnable.weight;
      if (randomWeight <= 0) {
        return spawnable.type;
      }
    }

    return DEFAULT_ENEMY_TYPE; // Failsafe in case of floating point issues
  }

  private spawnEnemy() {
    const enemy = this.enemyPool.get() as Enemy;
    if (!enemy) return;

    const typeKey = this.selectEnemyType();

    enemy.spawn(EnemyTypes[typeKey]);
    this.registryHelper.enemiesSpawned++;
  }

  private explode(sprite: Phaser.GameObjects.Sprite) {
    const explosion = this.explosionPool.get(sprite.x, sprite.y) as Explosion;
    if (explosion) {
      explosion.setActive(true).setVisible(true);
      explosion.play("explode");
      if (this.registryHelper.playSound) this.sound.play("enemy_explode");
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private collectPowerup(obj1: any, obj2: any) {
    const powerup = obj2 as Powerup;
    powerup.applyEffect(this);
    powerup.disableBody(true, true);
  }

  private pauseGame() {
    this.scene.pause();
    this.scene.launch("PauseScene");
  }
}
