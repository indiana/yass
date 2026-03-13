export interface IMovable {
    x: number;
    y: number;
    setVelocityX(x: number): void;
    setVelocityY(y: number): void;
}

export interface IPlayerEntity {
    x: number;
    y: number;
}

export interface IGameContext {
    enemiesSpawned: number;
    player: IPlayerEntity;
    // Helper for random numbers to avoid direct Phaser dependency in logic
    getRandom(min: number, max: number): number;
}
