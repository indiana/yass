import { IMovementStrategy, IShootingStrategy } from '../behaviors/IBehavior';
import { StaticXMovement, SineWaveMovement, PlayerTrackingMovement } from '../behaviors/Movement';
import { NoShooting, ProbabilisticShooting } from '../behaviors/Shooting';
import Phaser from 'phaser';

export interface EnemyConfig {
    type: string;
    sprite: string;
    hp: number;
    score: number;
    initialXVelocity: () => number; // X velocity can still be random at spawn
    baseYVelocity: number; // Base Y velocity before random addition
    yVelocityMultiplier: number;
    movement: IMovementStrategy;
    shooting: IShootingStrategy;
    bullet?: {
        damage: number;
    };
}

export const EnemyTypes: Record<string, EnemyConfig> = {
    grunt: {
        type: 'grunt',
        sprite: 'enemy1',
        hp: 10,
        score: 2,
        initialXVelocity: () => -5 + Phaser.Math.Between(0, 10),
        baseYVelocity: 150,
        yVelocityMultiplier: 1,
        movement: new PlayerTrackingMovement(),
        shooting: new ProbabilisticShooting(),
        bullet: { damage: 4 }
    },
    heavyGrunt: {
        type: 'heavyGrunt',
        sprite: 'enemy2',
        hp: 15,
        score: 3,
        initialXVelocity: () => -50 + Phaser.Math.Between(0, 100),
        baseYVelocity: 150,
        yVelocityMultiplier: 1,
        movement: new PlayerTrackingMovement(),
        shooting: new ProbabilisticShooting(),
        bullet: { damage: 5 }
    },
    kamikaze: {
        type: 'kamikaze',
        sprite: 'enemy3',
        hp: 15,
        score: 4,
        initialXVelocity: () => 0,
        baseYVelocity: 250, // Original was 150 + 100 for enemy3
        yVelocityMultiplier: 2, // 2x faster as requested
        movement: new StaticXMovement(),
        shooting: new NoShooting()
    },
    scout: {
        type: 'scout',
        sprite: 'enemy4',
        hp: 1,
        score: 1,
        initialXVelocity: () => 0, // Sine wave will control this
        baseYVelocity: 150,
        yVelocityMultiplier: 1,
        movement: new SineWaveMovement(),
        shooting: new ProbabilisticShooting(),
        bullet: { damage: 2 }
    }
};
