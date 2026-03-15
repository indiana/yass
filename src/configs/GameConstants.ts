export const GameConstants = {
  SHOT_DELAY: 100,
  NUMBER_OF_EXPLOSIONS: 20,
  WEAPON_POWERUP_LIMIT: 500,
  PLAYER: {
    INITIAL_HEALTH: 10,
    DAMAGE_ON_HIT: 1,
  },
  ENEMY: {
    DAMAGE_ON_HIT: 5,
  },
  BACKGROUND: {
    SCROLL_SPEED_BASE: 1,
    LAYERS: [
      {
        key: "stars_distant",
        count: 400,
        size: { min: 0.5, max: 1.5 },
        alpha: { min: 0.2, max: 0.5 },
        speedMultiplier: 0.5,
      },
      {
        key: "stars_mid",
        count: 200,
        size: { min: 1, max: 2 },
        alpha: { min: 0.4, max: 0.8 },
        speedMultiplier: 1.0,
      },
      {
        key: "stars_near",
        count: 50,
        size: { min: 1.5, max: 3 },
        alpha: { min: 0.7, max: 1.0 },
        speedMultiplier: 2.0,
      },
      {
        key: "nebulae",
        count: 5,
        size: { min: 100, max: 300 },
        alpha: { min: 0.05, max: 0.15 },
        speedMultiplier: 0.2,
      },
    ],
  },
};
