import Phaser from 'phaser';

export class Background extends Phaser.GameObjects.Container {
    private bg100: Phaser.GameObjects.TileSprite;
    private bg80: Phaser.GameObjects.TileSprite;
    private bg60: Phaser.GameObjects.TileSprite;

    constructor(scene: Phaser.Scene) {
        super(scene);
        const { width, height } = scene.cameras.main;

        this.bg100 = scene.add.tileSprite(0, 0, width, height, 'bg100').setOrigin(0, 0);
        this.bg80 = scene.add.tileSprite(0, 0, width, height, 'bg80').setOrigin(0, 0);
        this.bg60 = scene.add.tileSprite(0, 0, width, height, 'bg60').setOrigin(0, 0);

        this.add([this.bg100, this.bg80, this.bg60]);
        scene.add.existing(this);
    }

    preUpdate(time: number, delta: number) {
        // TileSprites don't have a preUpdate that moves tiles, so we do it here
        this.bg100.tilePositionY -= 1;
        this.bg80.tilePositionY -= 2;
        this.bg60.tilePositionY -= 4;
    }
}