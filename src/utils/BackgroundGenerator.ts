import Phaser from "phaser";

export interface IGeneratorConfig {
  key: string;
  count: number;
  size: { min: number; max: number };
  alpha: { min: number; max: number };
}

export class StarGenerator {
  public static generate(
    scene: Phaser.Scene,
    config: IGeneratorConfig,
    width: number,
    height: number
  ): string {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });

    for (let i = 0; i < config.count; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.FloatBetween(config.size.min, config.size.max);
      const alpha = Phaser.Math.FloatBetween(config.alpha.min, config.alpha.max);

      this.drawWraparoundCircle(graphics, x, y, radius, 0xffffff, alpha, width, height);
    }

    graphics.generateTexture(config.key, width, height);
    graphics.destroy();

    return config.key;
  }

  protected static drawWraparoundCircle(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    radius: number,
    color: number,
    alpha: number,
    width: number,
    height: number
  ) {
    graphics.fillStyle(color, alpha);
    
    // Draw the main circle
    graphics.fillCircle(x, y, radius);

    // Check for wraparound (horizontal)
    const left = x - radius < 0;
    const right = x + radius > width;
    const top = y - radius < 0;
    const bottom = y + radius > height;

    if (left) graphics.fillCircle(x + width, y, radius);
    if (right) graphics.fillCircle(x - width, y, radius);
    if (top) graphics.fillCircle(x, y + height, radius);
    if (bottom) graphics.fillCircle(x, y - height, radius);

    // Corners
    if (left && top) graphics.fillCircle(x + width, y + height, radius);
    if (left && bottom) graphics.fillCircle(x + width, y - height, radius);
    if (right && top) graphics.fillCircle(x - width, y + height, radius);
    if (right && bottom) graphics.fillCircle(x - width, y - height, radius);
  }
}

export class NebulaGenerator extends StarGenerator {
  public static generate(
    scene: Phaser.Scene,
    config: IGeneratorConfig,
    width: number,
    height: number
  ): string {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    const colors = [0x442288, 0x224488, 0x4488aa, 0x663399];

    // Create a temporary "soft particle" texture if it doesn't exist
    if (!scene.textures.exists("nebula_particle")) {
      const pGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
      // Draw a radial-like circle by layering circles with decreasing alpha
      const pSize = 64;
      const center = pSize / 2;
      for (let r = center; r > 0; r -= 2) {
        const alpha = Math.pow(1 - r / center, 2) * 0.5;
        pGraphics.fillStyle(0xffffff, alpha);
        pGraphics.fillCircle(center, center, r);
      }
      pGraphics.generateTexture("nebula_particle", pSize, pSize);
      pGraphics.destroy();
    }

    for (let i = 0; i < config.count; i++) {
      const centerX = Phaser.Math.Between(0, width);
      const centerY = Phaser.Math.Between(0, height);
      const clusterSize = Phaser.Math.FloatBetween(config.size.min, config.size.max);
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];

      const particleCount = 30;
      for (let j = 0; j < particleCount; j++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * clusterSize;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        
        const falloff = 1 - (dist / clusterSize);
        const size = (clusterSize * 0.8) * falloff;
        const alpha = Phaser.Math.FloatBetween(config.alpha.min, config.alpha.max) * falloff;

        // Draw the soft particle with the nebula color
        this.drawWraparoundParticle(graphics, x, y, size, color, alpha, width, height);
      }
    }

    graphics.generateTexture(config.key, width, height);
    graphics.destroy();

    return config.key;
  }

  private static drawWraparoundParticle(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    size: number,
    color: number,
    alpha: number,
    width: number,
    height: number
  ) {
    graphics.setBlendMode(Phaser.BlendModes.ADD);
    graphics.tintFill = true;
    
    const draw = (dx: number, dy: number) => {
        // We use a custom drawing method since Graphics doesn't have "drawTexture"
        // Instead, we use a very soft circle with very low alpha to simulate the gradient
        // if we are sticking to Graphics for the final texture generation.
        // To make it TRULY smooth without sharp edges, we layer 5-6 circles.
        const steps = 6;
        for(let s = 1; s <= steps; s++) {
            const r = (size / 2) * (s / steps);
            const stepAlpha = alpha * (1 - (s / steps)) * 0.3;
            graphics.fillStyle(color, stepAlpha);
            graphics.fillCircle(dx, dy, r);
        }
    };

    draw(x, y);

    // Wraparound logic
    const radius = size / 2;
    const left = x - radius < 0;
    const right = x + radius > width;
    const top = y - radius < 0;
    const bottom = y + radius > height;

    if (left) draw(x + width, y);
    if (right) draw(x - width, y);
    if (top) draw(x, y + height);
    if (bottom) draw(x, y - height);
    if (left && top) draw(x + width, y + height);
    if (left && bottom) draw(x + width, y - height);
    if (right && top) draw(x - width, y + height);
    if (right && bottom) draw(x - width, y - height);
    
    graphics.setBlendMode(Phaser.BlendModes.NORMAL);
  }
}
