import Phaser from "phaser";
import { GameConstants } from "../configs/GameConstants";
import { StarGenerator, NebulaGenerator } from "../utils/BackgroundGenerator";
import { Play } from "../scenes/Play";

export class ProceduralBackground extends Phaser.GameObjects.Container {
  private layers: { sprite: Phaser.GameObjects.TileSprite; multiplier: number }[] = [];

  constructor(scene: Play) {
    super(scene);
    const { width, height } = scene.cameras.main;

    GameConstants.BACKGROUND.LAYERS.forEach((layerConfig) => {
      let textureKey: string;
      if (layerConfig.key.includes("nebulae")) {
        textureKey = NebulaGenerator.generate(scene, layerConfig, width, height);
      } else {
        textureKey = StarGenerator.generate(scene, layerConfig, width, height);
      }

      const sprite = scene.add.tileSprite(0, 0, width, height, textureKey).setOrigin(0, 0);
      this.add(sprite);
      this.layers.push({ sprite, multiplier: layerConfig.speedMultiplier });
    });

    scene.add.existing(this);

    // Ensure we clean up textures when this object is destroyed
    this.once("destroy", () => {
        this.cleanupTextures();
    });
  }

  preUpdate(_time: number, _delta: number) {
    const playScene = this.scene as Play;
    const enemiesSpawned = playScene.registryHelper.enemiesSpawned;
    
    // Scale speed slightly based on progression (e.g., +10% every 100 enemies)
    const speedScale = 1 + (enemiesSpawned / 1000);
    const baseSpeed = GameConstants.BACKGROUND.SCROLL_SPEED_BASE * speedScale;

    this.layers.forEach((layer) => {
      layer.sprite.tilePositionY -= baseSpeed * layer.multiplier;
    });
  }

  private cleanupTextures() {
    GameConstants.BACKGROUND.LAYERS.forEach((layerConfig) => {
        if (this.scene.textures.exists(layerConfig.key)) {
            this.scene.textures.remove(layerConfig.key);
        }
    });
  }
}
