export const ACHIEVEMENTS = [
  { id: 'first-blood', name: 'First Blood', description: 'Complete your first quest', requirement: 'complete', target: 1 },
  { id: 'beginning', name: 'The Beginning', description: 'Reach level 2', requirement: 'level', target: 2 },
  { id: 'dedicated', name: 'Dedicated Adventurer', description: 'Complete 10 quests', requirement: 'complete', target: 10 },
  { id: 'unstoppable', name: 'Unstoppable', description: 'Complete 5 quests in one day', requirement: 'day', target: 5 },
  { id: 'scholar', name: 'The Scholar', description: 'Complete 10 learning quests', requirement: 'learning', target: 10 },
  { id: 'iron-will', name: 'Iron Will', description: 'Maintain a 7-day streak', requirement: 'streak', target: 7 },
  { id: 'legendary', name: 'Legendary Adventurer', description: 'Complete 100 quests', requirement: 'complete', target: 100 }
];

export function achievementProgress(state, achievement) {
  const completed = state.quests.filter(q => q.status === 'completed');
  switch (achievement.requirement) {
    case 'level': return state.character.level;
    case 'streak': return state.streak.longest;
    case 'learning': return completed.filter(q => q.category === 'Guild Quest' || q.attribute === 'Intelligence').length;
    case 'day': {
      const counts = {};
      completed.forEach(q => { const d = (q.completedDate || '').slice(0, 10); counts[d] = (counts[d] || 0) + 1; });
      return Math.max(0, ...Object.values(counts));
    }
    default: return completed.length;
  }
}
