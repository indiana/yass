import Phaser from 'phaser';
export class Background extends Phaser.GameObjects.Container {
    bg100;
    bg80;
    bg60;
    constructor(scene) {
        super(scene);
        const { width, height } = scene.cameras.main;
        this.bg100 = scene.add.tileSprite(0, 0, width, height, 'bg100').setOrigin(0, 0);
        this.bg80 = scene.add.tileSprite(0, 0, width, height, 'bg80').setOrigin(0, 0);
        this.bg60 = scene.add.tileSprite(0, 0, width, height, 'bg60').setOrigin(0, 0);
        this.add([this.bg100, this.bg80, this.bg60]);
        scene.add.existing(this);
    }
    update() {
        this.bg100.tilePositionY -= 1;
        this.bg80.tilePositionY -= 2;
        this.bg60.tilePositionY -= 4;
    }
}
//# sourceMappingURL=Background.js.map