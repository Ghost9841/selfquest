const BASE_XP = 20;
const SCALING_FACTOR = 1.5;

export function calculateXPToNext(level: number): number {
    return Math.floor(BASE_XP * Math.pow(SCALING_FACTOR, level - 1));
}

export function checkLevelUp(
    xp: number,
    xpToNext: number,
    level: number
): {
    remainingXP: number;
    newLevel: number;
    newXpToNext: number;
    leveledUp: boolean;
} {
    let remainingXP = xp;
    let newLevel = level;
    let newXpToNext = xpToNext;``
    let leveledUp = false;

    while (remainingXP >= newXpToNext) {
        remainingXP -= newXpToNext;
        newLevel += 1;
        newXpToNext = calculateXPToNext(newLevel);
        leveledUp = true;
    }

    return { remainingXP, newLevel, newXpToNext, leveledUp };
}