import Phaser from "phaser";
import { ProceduralBackground } from "../prefabs/ProceduralBackground";
import { Bullet } from "../prefabs/Bullet";
import { Enemy } from "../prefabs/Enemy";
import { Explosion } from "../prefabs/Explosion";
import { Powerup } from "../prefabs/Powerup";
import { Player } from "../prefabs/Player";
import { GameRegistry, WeaponMode } from "../utils/GameRegistry";
import { EnemyTypes } from "../configs/EnemyConfig";
import { PowerupSpawner } from "../managers/PowerupSpawner";
import { IPowerupSpawnerContext } from "../interfaces/IGameEntities";
import { GameConstants } from "../configs/GameConstants";
import {
  CollisionManager,
  ICollisionManagerContext,
} from "../managers/CollisionManager";
import { ProjectileManager } from "../managers/ProjectileManager";
import { WaveManager, IWaveContext } from "../managers/WaveManager";

export class Play extends Phaser.Scene {
  private WEAPON_POWERUP_LIMIT = GameConstants.WEAPON_POWERUP_LIMIT;

  public player!: Player; // Public for strategies
  private background!: ProceduralBackground;
  private playerBulletPool!: Phaser.Physics.Arcade.Group;
  private enemyBulletPool!: Phaser.Physics.Arcade.Group;
  private enemyPool!: Phaser.Physics.Arcade.Group;
  private powerupPool!: Phaser.Physics.Arcade.Group;
  private explosionPool!: Phaser.GameObjects.Group;

  public registryHelper!: GameRegistry; // Public for strategies
  private sKey!: Phaser.Input.Keyboard.Key;
  private pKey!: Phaser.Input.Keyboard.Key;

  private powerupSpawner!: PowerupSpawner;
  private collisionManager!: CollisionManager;
  public projectileManager!: ProjectileManager;
  private waveManager!: WaveManager;

  constructor() {
    super("Play");
  }

  create() {
    const { width } = this.cameras.main;
    this.registryHelper = new GameRegistry(this);
    this.registryHelper.reset();

    this.background = new ProceduralBackground(this);

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
      maxSize: GameConstants.NUMBER_OF_EXPLOSIONS,
      runChildUpdate: true,
    });

    this.projectileManager = new ProjectileManager(
      this,
      this.registryHelper,
      this.playerBulletPool,
      this.enemyBulletPool
    );

    this.player = new Player(this, width / 2, 550, this.projectileManager);

    const spawnerContext: IPowerupSpawnerContext = {
      getPowerup: () => this.powerupPool.get() as Powerup,
      getRandom: Phaser.Math.Between,
    };
    this.powerupSpawner = new PowerupSpawner(spawnerContext);

    // Initialize Collision Manager
    const collisionContext: ICollisionManagerContext = {
      scene: this,
      registry: this.registryHelper,
      powerupSpawner: this.powerupSpawner,
      explosionPool: this.explosionPool,
      enemyPool: this.enemyPool,
    };
    this.collisionManager = new CollisionManager(collisionContext);

    this.waveManager = new WaveManager();

    this.scene.launch("UIScene");

    this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.pKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this.physics.add.overlap(
      this.playerBulletPool,
      this.enemyPool,
      (b, e) => this.collisionManager.handleEnemyHit(b, e),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.enemyBulletPool,
      this.player,
      (p, b) => this.collisionManager.handlePlayerHit(p, b),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.enemyPool,
      this.player,
      (p, e) => this.collisionManager.handlePlayerRammed(p, e),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.powerupPool,
      this.player,
      (p, pu) => this.collisionManager.handleCollectPowerup(p, pu),
      undefined,
      this
    );

    this.spawnEnemyByType("grunt"); // Initial spawn
  }

  update(time: number) {
    if (Phaser.Input.Keyboard.JustDown(this.sKey))
      this.registryHelper.toggleSound();
    if (Phaser.Input.Keyboard.JustDown(this.pKey)) this.pauseGame();

    // Delegate spawning to WaveManager
    const waveContext: IWaveContext = {
      enemiesSpawned: this.registryHelper.enemiesSpawned,
      spawnEnemy: (type) => this.spawnEnemyByType(type),
      getRandom: Phaser.Math.Between,
    };
    this.waveManager.update(time, waveContext);

    // Weapon mode degradation
    if (
      this.registryHelper.weaponMode > WeaponMode.SINGLE &&
      this.registryHelper.powerupShots <= this.registryHelper.shotsFired
    ) {
      this.registryHelper.downgradeWeapon();
      this.registryHelper.setPowerupShots(
        this.registryHelper.shotsFired + this.WEAPON_POWERUP_LIMIT
      );
    }
  }

  private spawnEnemyByType(typeKey: string) {
    const enemy = this.enemyPool.get() as Enemy;
    if (!enemy) return;

    enemy.spawn(EnemyTypes[typeKey]);
    this.registryHelper.incrementEnemiesSpawned();
  }

  private pauseGame() {
    this.scene.pause();
    this.scene.launch("PauseScene");
  }
}
