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
    score: number;
    player: IPlayerEntity;
    // Helper for random numbers to avoid direct Phaser dependency in logic
    getRandom(min: number, max: number): number;
    // Method to trigger enemy fire from logic
    enemyShoot(entity: IMovable, time: number): void;
}

export interface IPowerup {
    spawn(config: unknown, x: number, y: number): void;
}

export interface IPowerupSpawnerContext {
    getPowerup(): IPowerup | null;
    getRandom(min: number, max: number): number;
}
