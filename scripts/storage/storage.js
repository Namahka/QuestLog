const STORAGE_KEY = 'questlog-state';
export const DATA_VERSION = 1;

const attributes = () => ({ Strength: 0, Intelligence: 0, Wisdom: 0, Dexterity: 0, Vitality: 0, Discipline: 0 });

export function createDefaultState() {
  return {
    version: DATA_VERSION,
    character: { name: 'Nameless Adventurer', level: 1, xp: 0, totalXp: 0, title: 'Wayfarer', avatar: 'wayfarer', attributes: attributes() },
    quests: [],
    inventory: [],
    achievements: [],
    streak: { current: 0, longest: 0, lastCompletionDate: null },
    chronicle: [{ id: crypto.randomUUID(), type: 'journey', description: 'Your chronicle begins. The road ahead is unwritten.', timestamp: new Date().toISOString() }],
    settings: { sound: true, animations: true, reducedMotion: false, theme: 'Default' }
  };
}

function validState(value) {
  return value && typeof value === 'object' && value.version === DATA_VERSION &&
    value.character && Array.isArray(value.quests) && Array.isArray(value.inventory) &&
    Array.isArray(value.achievements) && Array.isArray(value.chronicle);
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    if (!validState(parsed)) throw new Error('Unsupported save data');
    return parsed;
  } catch (error) {
    console.error('Could not load QuestLog state:', error);
    return createDefaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Could not save QuestLog state:', error);
  }
}
