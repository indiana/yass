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

export interface IProjectileManager {
    fire(x: number, y: number, velocityX: number, velocityY: number, damage: number, isPlayer: boolean): void;
}

export interface IGameContext {
    enemiesSpawned: number;
    score: number;
    player: IPlayerEntity;
    // Helper for random numbers to avoid direct Phaser dependency in logic
    getRandom(min: number, max: number): number;
    // Decoupled projectile management
    projectileManager: IProjectileManager;
}

export interface IPowerup {
    spawn(config: unknown, x: number, y: number): void;
}

export interface IPowerupSpawnerContext {
    getPowerup(): IPowerup | null;
    getRandom(min: number, max: number): number;
}
