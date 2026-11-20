export const XP_REWARDS = Object.freeze({ Easy: 10, Normal: 25, Hard: 50, Legendary: 100 });

export function xpRequired(level) {
  return 100 + level * 50;
}

export function awardXp(character, amount) {
  let xp = character.xp + amount;
  let level = character.level;
  const levels = [];
  while (xp >= xpRequired(level)) {
    xp -= xpRequired(level);
    level += 1;
    levels.push(level);
  }
  character.level = level;
  character.xp = xp;
  character.totalXp += amount;
  return levels;
}
