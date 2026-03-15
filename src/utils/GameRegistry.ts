import Phaser from 'phaser';

export enum WeaponMode {
    SINGLE = 0,
    DOUBLE = 1,
    TRIPLE = 2
}

export class GameRegistry {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    // --- Score ---
    get score(): number { return this.scene.registry.get('score') || 0; }

    public addScore(amount: number): void {
        const current = this.score;
        this.scene.registry.set('score', current + amount);
    }

    // --- Health ---
    get health(): number { return this.scene.registry.get('health') || 0; }

    public damagePlayer(amount: number): void {
        const current = this.health;
        this.scene.registry.set('health', Math.max(0, current - amount));
    }

    public healPlayer(amount: number): void {
        const current = this.health;
        // Assuming max health is 10 based on previous logic, but should be configurable.
        // For now, let's just add without capping or cap at a sensible default if known.
        // Previous logic had Math.min(10, ...).
        this.scene.registry.set('health', Math.min(10, current + amount));
    }

    // --- Weapon ---
    get weaponMode(): WeaponMode { return this.scene.registry.get('weaponMode') || WeaponMode.SINGLE; }

    public upgradeWeapon(): void {
        const current = this.weaponMode;
        if (current < WeaponMode.TRIPLE) {
            this.scene.registry.set('weaponMode', current + 1);
        }
    }

    public downgradeWeapon(): void {
        const current = this.weaponMode;
        if (current > WeaponMode.SINGLE) {
            this.scene.registry.set('weaponMode', current - 1);
        }
    }

    public setWeaponMode(mode: WeaponMode): void {
        this.scene.registry.set('weaponMode', mode);
    }

    // --- Shots Fired ---
    get shotsFired(): number { return this.scene.registry.get('shotsFired') || 0; }

    public incrementShotsFired(): void {
        const current = this.shotsFired;
        this.scene.registry.set('shotsFired', current + 1);
    }

    // --- Powerup Shots ---
    get powerupShots(): number { return this.scene.registry.get('powerupShots') || 0; }

    public addPowerupShots(amount: number): void {
        const current = this.powerupShots;
        this.scene.registry.set('powerupShots', current + amount);
    }

    public setPowerupShots(amount: number): void {
        this.scene.registry.set('powerupShots', amount);
    }

    // --- Enemy Spawning ---
    get enemiesSpawned(): number { return this.scene.registry.get('enemiesSpawned') || 0; }

    public incrementEnemiesSpawned(): void {
        const current = this.enemiesSpawned;
        this.scene.registry.set('enemiesSpawned', current + 1);
    }

    // --- Settings ---
    get playSound(): boolean { 
        const sound = this.scene.registry.get('playSound');
        return sound === undefined ? true : sound;
    }

    public toggleSound(): void {
        const current = this.playSound;
        this.scene.registry.set('playSound', !current);
        localStorage.setItem('playSound', !current ? '1' : '0');
    }

    reset() {
        this.scene.registry.set('score', 0);
        this.scene.registry.set('health', 10);
        this.scene.registry.set('weaponMode', WeaponMode.SINGLE);
        this.scene.registry.set('shotsFired', 0);
        this.scene.registry.set('powerupShots', 0);
        this.scene.registry.set('enemiesSpawned', 0);

        const storedSound = localStorage.getItem('playSound');
        // If undefined/null, default to true
        const soundEnabled = storedSound !== '0'; 
        this.scene.registry.set('playSound', soundEnabled);
    }
}