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

    // Scores and stats
    get score(): number { return this.scene.registry.get('score') || 0; }
    set score(value: number) { this.scene.registry.set('score', value); }

    get health(): number { return this.scene.registry.get('health') || 0; }
    set health(value: number) { this.scene.registry.set('health', value); }

    get weaponMode(): WeaponMode { return this.scene.registry.get('weaponMode') || WeaponMode.SINGLE; }
    set weaponMode(value: WeaponMode) { this.scene.registry.set('weaponMode', value); }

    get shotsFired(): number { return this.scene.registry.get('shotsFired') || 0; }
    set shotsFired(value: number) { this.scene.registry.set('shotsFired', value); }

    get powerupShots(): number { return this.scene.registry.get('powerupShots') || 0; }
    set powerupShots(value: number) { this.scene.registry.set('powerupShots', value); }

    get enemiesSpawned(): number { return this.scene.registry.get('enemiesSpawned') || 0; }
    set enemiesSpawned(value: number) { this.scene.registry.set('enemiesSpawned', value); }

    // Settings
    get playSound(): boolean { 
        const sound = this.scene.registry.get('playSound');
        return sound === undefined ? true : sound;
    }
    set playSound(value: boolean) { 
        this.scene.registry.set('playSound', value);
        localStorage.setItem('playSound', value ? '1' : '0');
    }

    reset() {
        this.score = 0;
        this.health = 10;
        this.weaponMode = WeaponMode.SINGLE;
        this.shotsFired = 0;
        this.powerupShots = 0;
        this.enemiesSpawned = 0;
        
        const storedSound = localStorage.getItem('playSound');
        this.playSound = storedSound !== '0';
    }
}