import { loadState, saveState, createDefaultState } from './storage/storage.js';
import { XP_REWARDS, awardXp, xpRequired } from './systems/progression.js';
import { updateStreak } from './systems/streaks.js';
import { ACHIEVEMENTS, achievementProgress } from './systems/achievements.js';

let state = loadState();
let currentPage = 'hall';

const content = document.querySelector('#content');
const modalBackdrop = document.querySelector('#modalBackdrop');
const questForm = document.querySelector('#questForm');

const questTemplates = [
  { title: 'Take a short walk', description: 'Go for a 15-minute walk.', category: 'Daily Quest', difficulty: 'Normal', attribute: 'Strength' },
  { title: 'Read for 15 minutes', description: 'Read a book or article for a little while.', category: 'Daily Quest', difficulty: 'Easy', attribute: 'Intelligence' },
  { title: 'Plan tomorrow', description: 'Choose a few priorities for tomorrow.', category: 'Daily Quest', difficulty: 'Easy', attribute: 'Wisdom' },
  { title: 'Practice a skill', description: 'Spend 20 minutes practising a hobby.', category: 'Side Quest', difficulty: 'Normal', attribute: 'Dexterity' },
  { title: 'Take a mindful break', description: 'Pause and take a few calm breaths.', category: 'Daily Quest', difficulty: 'Easy', attribute: 'Vitality' },
  { title: 'Tidy one small space', description: 'Reset one drawer, shelf, or surface.', category: 'Side Quest', difficulty: 'Easy', attribute: 'Discipline' }
];

const avatars = [
  { id: 'wayfarer', name: 'Wayfarer', art: '<circle cx="60" cy="60" r="57" fill="#83c7bd"/><path d="M16 116c3-25 18-39 44-39s41 14 44 39H16Z" fill="#315d56"/><path d="M49 73h22v20H49z" fill="#e2b77f"/><path d="M35 48c0-20 11-32 25-32s25 12 25 32v13c0 18-11 29-25 29S35 79 35 61V48Z" fill="#f3cf9d"/><path d="M34 49c-2-26 10-39 28-39 17 0 27 13 25 37-8-4-13-11-15-19-9 11-22 17-38 21Z" fill="#67432f"/><path d="M44 57h7v5h-7zm25 0h7v5h-7z" fill="#382a22"/><path d="M52 72c5 4 11 4 16 0" fill="none" stroke="#a9574a" stroke-width="3" stroke-linecap="round"/><path d="m45 82 15 13 15-13" fill="#e7d29d"/>' },
  { id: 'knight', name: 'Knight', art: '<circle cx="60" cy="60" r="57" fill="#8bc5df"/><path d="M13 117c3-25 19-40 47-40s44 15 47 40H13Z" fill="#55718b"/><path d="m43 76 17 17 17-17 13 9-8 32H38l-8-32z" fill="#c5d5d9" stroke="#586b76" stroke-width="3"/><path d="M31 48c0-23 11-36 29-36s29 13 29 36v20c0 9-8 15-16 15H47c-8 0-16-6-16-15V48Z" fill="#d9e3df" stroke="#566873" stroke-width="4"/><path d="M39 52c0-15 8-24 21-24s21 9 21 24v13H39V52Z" fill="#efc997"/><path d="M28 49 34 27 60 9l26 18 6 22-13-7-4-13-15 9-17-9-4 14z" fill="#758c96" stroke="#4c6069" stroke-width="3"/><path d="M40 66h40v9H40z" fill="#6d8490"/><path d="M47 58h7v4h-7zm19 0h7v4h-7z" fill="#293742"/><path d="M58 67h5" stroke="#fff1bc" stroke-width="3"/><path d="m60 8 5 9h-10z" fill="#e7bd59"/>' },
  { id: 'mage', name: 'Mage', art: '<circle cx="60" cy="60" r="57" fill="#b3a0dc"/><path d="M12 117c4-25 19-40 48-40s44 15 48 40H12Z" fill="#594b87"/><path d="M45 73h30v24H45z" fill="#e6b987"/><path d="M34 51c0-20 10-31 26-31s26 11 26 31v14c0 18-11 29-26 29S34 83 34 65V51Z" fill="#f0c99b"/><path d="m22 45 35-39 11 26 31 12-15 7-2 16-12-10H40l-5 12-8-17z" fill="#574485" stroke="#39335f" stroke-width="3"/><path d="M45 58h7v5h-7zm24 0h7v5h-7z" fill="#32283a"/><path d="M50 74c6 4 13 4 19 0" fill="none" stroke="#a95761" stroke-width="3" stroke-linecap="round"/><path d="m80 19 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#ffe17a"/><path d="m45 83 15 14 15-14" fill="#d9b27e"/>' },
  { id: 'ranger', name: 'Ranger', art: '<circle cx="60" cy="60" r="57" fill="#a5cb83"/><path d="M13 117c3-25 18-40 47-40s44 15 47 40H13Z" fill="#486640"/><path d="M45 74h30v23H45z" fill="#c99164"/><path d="M35 48c0-21 11-32 25-32s25 11 25 32v17c0 18-11 28-25 28S35 83 35 65V48Z" fill="#e9bd89"/><path d="M21 39 59 12l41 27H21Z" fill="#52713c" stroke="#344f31" stroke-width="4"/><path d="M30 43h61l-9 9H39z" fill="#385a37"/><path d="M42 57h8v5h-8zm28 0h8v5h-8z" fill="#342b21"/><path d="M52 74c5 3 11 3 16 0" fill="none" stroke="#9d5140" stroke-width="3" stroke-linecap="round"/><path d="m45 84 15 12 15-12" fill="#c7a86f"/><path d="m78 91 19 18" stroke="#805733" stroke-width="5"/>' },
  { id: 'rogue', name: 'Rogue', art: '<circle cx="60" cy="60" r="57" fill="#d79588"/><path d="M13 117c3-25 19-40 47-40s44 15 47 40H13Z" fill="#6f3942"/><path d="M45 75h30v22H45z" fill="#b9785e"/><path d="M34 48c0-21 11-32 26-32s26 11 26 32v17c0 18-11 29-26 29S34 83 34 65V48Z" fill="#e7b989"/><path d="M31 47c2-27 14-38 30-38 19 0 29 15 28 40l-10-13-10-8-25 9z" fill="#593b36"/><path d="M35 52h50v17H35z" fill="#75434a"/><path d="M42 54h14v8H42zm22 0h14v8H64z" fill="#f4d8a5"/><path d="M47 57h6v4h-6zm20 0h6v4h-6z" fill="#30272a"/><path d="m45 84 15 13 15-13" fill="#ad7652"/><path d="m26 25 8 5-7 8-8-5zm66 0 8 5-7 8-8-5z" fill="#d1ac5c"/>' }
];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function avatarPortrait(id = state.character.avatar || 'wayfarer') {
  const uploadedImage = state.character.avatarImage;
  if (id === 'custom' &&
      typeof uploadedImage === 'string' &&
      uploadedImage.length <= 1_500_000 &&
      /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(uploadedImage)) {
    return `<div class="portrait-sigil avatar-art custom-avatar" role="img" aria-label="Custom portrait"><img src="${uploadedImage}" alt=""></div>`;
  }
  const avatar = avatars.find(option => option.id === id) || avatars[0];
  return `<div class="portrait-sigil avatar-art avatar-${avatar.id}" role="img" aria-label="${avatar.name} portrait"><svg viewBox="0 0 120 120" aria-hidden="true">${avatar.art}</svg></div>`;
}

function readPortrait(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const image = new Image();
      image.addEventListener('load', () => {
        if (image.naturalWidth > 4096 || image.naturalHeight > 4096) {
          reject(new Error('Image dimensions exceed the supported limit.'));
          return;
        }
        try {
          const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Image processing is unavailable in this browser.'));
            return;
          }
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/webp', 0.86));
        } catch (error) {
          reject(error);
        }
      }, { once: true });
      image.addEventListener('error', () => reject(new Error('The selected file is not a readable image.')), { once: true });
      image.src = reader.result;
    }, { once: true });
    reader.addEventListener('error', () => reject(reader.error || new Error('The image file could not be read.')), { once: true });
    reader.readAsDataURL(file);
  });
}

function uid() {
  return crypto.randomUUID();
}

function addChronicle(type, description, associatedId = null) {
  state.chronicle.unshift({ id: uid(), type, description, timestamp: new Date().toISOString(), associatedId });
}

function notify(title, message, tone = 'gold') {
  const toast = document.createElement('article');
  toast.className = `toast toast-${tone}`;
  toast.innerHTML = `<div class="toast-rune" aria-hidden="true"></div><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div><button type="button" aria-label="Dismiss notification">&times;</button>`;
  toast.querySelector('button').addEventListener('click', () => toast.remove());
  document.querySelector('#toastRegion').append(toast);
  setTimeout(() => toast.remove(), 5000);
}

function persist() {
  saveState(state);
  updateChrome();
  render();
}

function updateChrome() {
  document.querySelector('#topStreak').textContent = state.streak.current;
  document.querySelector('#sidebarLevel').textContent = `Level ${state.character.level}`;
  document.querySelector('#sidebarTitle').textContent = state.character.title;
}

function completedCount() {
  return state.quests.filter(q => q.status === 'completed').length;
}

function sectionHeading(title, eyebrow) {
  document.querySelector('#pageTitle').textContent = title;
  document.querySelector('#pageEyebrow').textContent = eyebrow;
  document.title = `${title} - Little Legends`;
}

function renderHall() {
  sectionHeading('Welcome back, adventurer', 'Adventurer\'s Hall');
  const active = state.quests.filter(q => q.status !== 'completed');
  const completed = state.quests.filter(q => q.status === 'completed');
  const today = new Date().toISOString().slice(0, 10);
  const todayQuests = completed.filter(q => (q.completedDate || '').slice(0, 10) === today).length;
  const required = xpRequired(state.character.level);
  const percent = Math.round((state.character.xp / required) * 100);
  content.innerHTML = `
    <section class="hall-grid">
      <article class="hero-panel">
        <div class="character-portrait">${avatarPortrait()}</div>
        <div class="hero-details">
          <p class="eyebrow">${escapeHtml(state.character.title)}</p>
          <h2>${escapeHtml(state.character.name)}</h2>
          <div class="level-line"><strong>Level ${state.character.level}</strong><span>${state.character.xp} / ${required} XP</span></div>
          <div class="progress-track"><span style="width:${percent}%"></span></div>
        </div>
      </article>
      <article class="stat-strip">
        <div><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M13 2c1 5-3 6-1 10 2-1 3-3 3-6 4 3 6 7 4 11-2 4-10 5-14 0-4-5 1-12 8-15Z"/></svg></span><p>Current streak<strong>${state.streak.current} days</strong></p></div>
        <div><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/></svg></span><p>Longest streak<strong>${state.streak.longest} days</strong></p></div>
        <div><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M7 3h10l3 3v15H4V6l3-3Zm2 2v4h6V5H9Zm-2 8h10v-2H7v2Z"/></svg></span><p>Quests completed<strong>${completedCount()}</strong></p></div>
        <div><span class="stat-icon"><svg viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7l9-5Zm0 5-5 3v6l5 3 5-3v-6l-5-3Z"/></svg></span><p>Today's victories<strong>${todayQuests}</strong></p></div>
      </article>
    </section>
    <section class="hall-columns">
      <article class="panel quest-preview">
        <header class="panel-header"><div><p class="eyebrow">Today</p><h2>Active Quests</h2></div><button class="text-button" data-page-link="quests">View board</button></header>
        ${active.length ? active.slice(0, 4).map(questRow).join('') : '<div class="empty-state"><p>No active quests. The board awaits a new undertaking.</p><button class="button button-primary" data-add-quest>Add a quest</button></div>'}
      </article>
      <aside class="panel attributes-preview">
        <header class="panel-header"><div><p class="eyebrow">Character</p><h2>Attributes</h2></div></header>
        ${attributeList()}
      </aside>
    </section>
    <section class="hall-columns lower-columns">
      <article class="panel"><header class="panel-header"><div><p class="eyebrow">Recent</p><h2>Recent Achievements</h2></div><button class="text-button" data-page-link="achievements">View all</button></header>${achievementPreview()}</article>
      <article class="panel"><header class="panel-header"><div><p class="eyebrow">Chronicle</p><h2>Latest Entry</h2></div><button class="text-button" data-page-link="chronicle">Read all</button></header>${chroniclePreview()}</article>
    </section>`;
  bindDynamicActions();
}

function questRow(q) {
  return `<article class="quest-row">
    <button class="quest-check ${q.status === 'completed' ? 'checked' : ''}" type="button" data-toggle-quest="${q.id}" aria-label="${q.status === 'completed' ? 'Reopen' : 'Complete'} ${escapeHtml(q.title)}"></button>
    <div class="quest-main"><div><span class="quest-category">${escapeHtml(q.category)}</span><h3>${escapeHtml(q.title)}</h3></div><p>${escapeHtml(q.description || 'No further account recorded.')}</p></div>
    <span class="xp-reward">${XP_REWARDS[q.difficulty]} XP</span>
  </article>`;
}

function attributeList() {
  return Object.entries(state.character.attributes).map(([name, value]) => {
    const pct = Math.min(100, value * 5);
    return `<div class="attribute-row"><span>${escapeHtml(name)}</span><div class="attribute-track"><i style="width:${pct}%"></i></div><strong>${value}</strong></div>`;
  }).join('');
}

function achievementPreview() {
  const unlocked = ACHIEVEMENTS.filter(a => state.achievements.includes(a.id));
  if (!unlocked.length) return '<div class="empty-line">No achievements sealed yet.</div>';
  return unlocked.slice(-3).reverse().map(a => `<div class="mini-achievement"><span class="achievement-seal"></span><div><strong>${escapeHtml(a.name)}</strong><p>${escapeHtml(a.description)}</p></div></div>`).join('');
}

function chroniclePreview() {
  const entry = state.chronicle[0];
  if (!entry) return '<div class="empty-line">The chronicle is waiting.</div>';
  return `<div class="chronicle-preview"><time>${new Date(entry.timestamp).toLocaleDateString()}</time><p>${escapeHtml(entry.description)}</p></div>`;
}

function renderQuests() {
  sectionHeading('Quest Board', 'Guild Ledger');
  content.innerHTML = `
    <section class="board-toolbar panel">
      <label class="search-field"><span>Search</span><input id="questSearch" type="search" placeholder="Search the quest ledger"></label>
      <label><span>Status</span><select id="questStatus"><option value="active">Active</option><option value="completed">Completed</option><option value="all">All quests</option></select></label>
      <label><span>Category</span><select id="questCategory"><option value="all">All categories</option><option>Daily Quest</option><option>Main Quest</option><option>Side Quest</option><option>Guild Quest</option><option>Challenge</option></select></label>
      <button class="button button-primary" data-add-quest>New Quest</button>
    </section>
    <section class="quest-board" id="questBoard"></section>`;
  bindDynamicActions();
  renderQuestBoard();
  ['questSearch', 'questStatus', 'questCategory'].forEach(id => document.querySelector(`#${id}`).addEventListener(id === 'questSearch' ? 'input' : 'change', renderQuestBoard));
}

function renderQuestBoard() {
  const search = (document.querySelector('#questSearch')?.value || '').toLowerCase();
  const status = document.querySelector('#questStatus')?.value || 'active';
  const category = document.querySelector('#questCategory')?.value || 'all';
  const quests = state.quests.filter(q =>
    (!search || `${q.title} ${q.description}`.toLowerCase().includes(search)) &&
    (status === 'all' || (status === 'completed' ? q.status === 'completed' : q.status !== 'completed')) &&
    (category === 'all' || q.category === category)
  ).sort((a, b) => (a.status === b.status ? b.createdDate.localeCompare(a.createdDate) : a.status === 'completed' ? 1 : -1));
  document.querySelector('#questBoard').innerHTML = quests.length ? quests.map(q => `<article class="quest-card ${q.status === 'completed' ? 'completed' : ''}">
    <button class="quest-check ${q.status === 'completed' ? 'checked' : ''}" type="button" data-toggle-quest="${q.id}" aria-label="${q.status === 'completed' ? 'Reopen' : 'Complete'} ${escapeHtml(q.title)}"></button>
    <div class="quest-card-main"><div class="quest-meta"><span>${escapeHtml(q.category)}</span><span>${escapeHtml(q.difficulty)}</span></div><h3>${escapeHtml(q.title)}</h3><p>${escapeHtml(q.description || 'No further account recorded.')}</p><div class="quest-footer"><span>${escapeHtml(q.attribute)}</span></div></div>
    <div class="quest-card-actions"><strong>${XP_REWARDS[q.difficulty]} XP</strong><button type="button" data-edit-quest="${q.id}">Edit</button><button type="button" data-delete-quest="${q.id}">Delete</button></div>
  </article>`).join('') : '<div class="panel empty-board"><h2>No quests found</h2><p>Try changing the filters or record a new undertaking.</p></div>';
  bindDynamicActions();
}

function renderCharacter() {
  sectionHeading('Character', 'Adventurer Record');
  const required = xpRequired(state.character.level);
  content.innerHTML = `<section class="character-layout">
    <article class="panel character-sheet">
      <div class="large-sigil">${avatarPortrait()}</div>
      <p class="eyebrow">${escapeHtml(state.character.title)}</p><h2>${escapeHtml(state.character.name)}</h2>
      <div class="level-line"><strong>Level ${state.character.level}</strong><span>${state.character.xp} / ${required} XP</span></div><div class="progress-track"><span style="width:${Math.round(state.character.xp / required * 100)}%"></span></div>
      <button class="button button-ghost" data-page-link="settings">Edit character</button>
    </article>
    <article class="panel attribute-sheet"><header class="panel-header"><div><p class="eyebrow">Development</p><h2>Attributes</h2></div></header>${attributeList()}</article>
  </section>`;
  bindDynamicActions();
}

function renderInventory() {
  sectionHeading('Inventory', 'Adventurer Equipment');
  content.innerHTML = `<section class="inventory-layout"><article class="panel"><header class="panel-header"><div><p class="eyebrow">Satchel</p><h2>Collected Items</h2></div><span class="count-seal">${state.inventory.length}</span></header>
    ${state.inventory.length ? `<div class="inventory-grid">${state.inventory.map(item => `<article class="inventory-item ${item.rarity.toLowerCase()}"><div class="item-icon"></div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><span>${escapeHtml(item.rarity)} ${escapeHtml(item.type)}</span></article>`).join('')}</div>` :
    '<div class="empty-state inventory-empty"><h2>The satchel is empty</h2><p>Level-ups, quests and achievements may yield equipment and curios.</p></div>'}</article></section>`;
  bindDynamicActions();
}

function renderAchievements() {
  sectionHeading('Achievements', 'The Hall of Deeds');
  const cards = ACHIEVEMENTS.map(a => {
    const unlocked = state.achievements.includes(a.id);
    const progress = achievementProgress(state, a);
    const pct = Math.min(100, progress / a.target * 100);
    return `<article class="achievement-card ${unlocked ? 'unlocked' : 'locked'}"><div class="achievement-seal"></div><div><p class="eyebrow">${unlocked ? 'Sealed' : 'In progress'}</p><h3>${escapeHtml(a.name)}</h3><p>${escapeHtml(a.description)}</p><div class="achievement-progress"><span style="width:${pct}%"></span></div><small>${Math.min(progress, a.target)} / ${a.target}</small></div></article>`;
  }).join('');
  content.innerHTML = `<section class="achievements-grid">${cards}</section>`;
  bindDynamicActions();
}

function renderChronicle() {
  sectionHeading('Chronicle', 'Recorded Journey');
  const entries = state.chronicle.length ? state.chronicle.map(entry => `<article class="chronicle-entry"><time datetime="${escapeHtml(entry.timestamp)}">${new Date(entry.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time><div class="chronicle-rune"></div><div><p class="eyebrow">${escapeHtml(entry.type)}</p><p>${escapeHtml(entry.description)}</p></div></article>`).join('') : '<div class="empty-state"><p>No entries have been written.</p></div>';
  content.innerHTML = `<section class="panel chronicle-list">${entries}</section>`;
  bindDynamicActions();
}

function renderSettings() {
  sectionHeading('Settings', 'Adventurer Preferences');
  content.innerHTML = `<section class="settings-layout">
    <article class="panel settings-panel"><header class="panel-header"><div><p class="eyebrow">Identity</p><h2>Character</h2></div></header>
      <div class="avatar-picker" role="group" aria-label="Choose profile portrait">
        <p class="picker-label">Profile portrait</p>
        ${avatars.map(avatar => `<button class="avatar-option ${!state.character.avatarImage && avatar.id === (state.character.avatar || 'wayfarer') ? 'selected' : ''}" type="button" data-avatar="${avatar.id}" aria-pressed="${!state.character.avatarImage && avatar.id === (state.character.avatar || 'wayfarer')}">${avatarPortrait(avatar.id)}<span>${avatar.name}</span></button>`).join('')}
      </div>
      <div class="portrait-upload">
        <p class="picker-label">Or upload your own portrait</p>
        <div class="upload-control">
          <label class="button button-upload" for="profileImage">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 7 8h3v6h4V8h3l-5-5ZM5 16v4h14v-4h-3v1H8v-1H5Z"/></svg>
            <span>Choose portrait</span>
          </label>
          <input class="portrait-file-input" id="profileImage" type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="portraitHelp">
          <span class="upload-filename">${state.character.avatarImage ? 'Custom portrait selected' : 'No image selected'}</span>
        </div>
        <p class="upload-help" id="portraitHelp">PNG, JPG or WebP · max 1 MB</p>
      </div>
      <form id="characterForm"><label>Character name<input name="name" maxlength="40" value="${escapeHtml(state.character.name)}" required></label><label>Character title<input name="title" maxlength="40" value="${escapeHtml(state.character.title)}" required></label><button class="button button-primary" type="submit">Save Character</button></form>
    </article>
    <article class="panel settings-panel"><header class="panel-header"><div><p class="eyebrow">Preferences</p><h2>Experience</h2></div></header>
      <label class="toggle-row"><span><strong>Sound effects</strong><small>Enable interface sounds</small></span><input type="checkbox" data-setting="sound" ${state.settings.sound ? 'checked' : ''}></label>
      <label class="toggle-row"><span><strong>Animations</strong><small>Enable interface motion</small></span><input type="checkbox" data-setting="animations" ${state.settings.animations ? 'checked' : ''}></label>
      <label class="toggle-row"><span><strong>Reduced motion</strong><small>Minimize decorative movement</small></span><input type="checkbox" data-setting="reducedMotion" ${state.settings.reducedMotion ? 'checked' : ''}></label>
    </article>
    <article class="panel reset-panel"><header class="panel-header"><div><p class="eyebrow">Danger</p><h2>Begin Again</h2></div></header><p>Resetting removes quests, XP, items, achievements and chronicle entries.</p><button class="button button-danger" id="resetProgress">Reset all progression</button></article>
  </section>`;
  const characterForm = document.querySelector('#characterForm');
  document.querySelectorAll('[data-avatar]').forEach(button => button.addEventListener('click', () => {
    state.character.avatar = button.dataset.avatar;
    state.character.avatarImage = null;
    addChronicle('character-customized', `Portrait changed to ${avatars.find(avatar => avatar.id === button.dataset.avatar).name}.`);
    persist();
    notify('Portrait changed', 'Your new profile portrait has been saved.');
  }));
  document.querySelector('#profileImage').addEventListener('change', async event => {
    const input = event.currentTarget;
    const file = input.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      notify('Unsupported image', 'Choose a PNG, JPEG or WebP image.', 'blood');
      input.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      notify('Image is too large', 'Choose an image smaller than 1 MB.', 'blood');
      input.value = '';
      return;
    }
    try {
      state.character.avatarImage = await readPortrait(file);
      state.character.avatar = 'custom';
      addChronicle('character-customized', 'A custom profile portrait was uploaded.');
      persist();
      notify('Portrait updated', 'Your custom image has been saved in this browser.');
    } catch (error) {
      console.error('Could not upload profile portrait:', error);
      notify('Portrait could not be uploaded', 'Choose a valid PNG, JPEG or WebP image.', 'blood');
      input.value = '';
    }
  });
  characterForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(characterForm);
    state.character.name = data.get('name').trim();
    state.character.title = data.get('title').trim();
    persist();
    notify('Record updated', 'Your adventurer identity has been changed.');
  });
  document.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', () => {
    state.settings[input.dataset.setting] = input.checked;
    document.documentElement.classList.toggle('reduced-motion', state.settings.reducedMotion);
    persist();
  }));
  document.querySelector('#resetProgress').addEventListener('click', () => openResetModal());
  bindDynamicActions();
}

function openResetModal() {
  const modalTitle = document.querySelector('#modalTitle');
  const form = questForm;
  modalTitle.textContent = 'Reset progression';
  form.innerHTML = `<p class="reset-warning">This will permanently erase all Little Legends progress stored in this browser.</p><div class="modal-actions"><button class="button button-ghost" id="cancelModal" type="button">Cancel</button><button class="button button-danger" type="submit">Reset Everything</button></div>`;
  modalBackdrop.hidden = false;
  form.onsubmit = event => {
    event.preventDefault();
    state = createDefaultState();
    persist();
    closeModal();
    notify('A new journey begins', 'Little Legends progression has been reset.', 'blood');
  };
  document.querySelector('#cancelModal').addEventListener('click', closeModal);
  document.querySelector('#closeModal').addEventListener('click', closeModal);
}

function openQuestModal(quest = null) {
  questForm.reset();
  const suggestions = quest ? '' : `
    <fieldset class="quest-suggestions">
      <legend>Need an idea? Choose a suggested quest</legend>
      <div class="quest-template-grid">
        ${questTemplates.map((template, index) => `<button class="quest-template" type="button" data-quest-template="${index}" aria-pressed="false">
          <strong>${escapeHtml(template.title)}</strong>
          <small>${escapeHtml(template.difficulty)} · ${XP_REWARDS[template.difficulty]} XP</small>
        </button>`).join('')}
      </div>
    </fieldset>`;
  questForm.innerHTML = `
    <input type="hidden" name="id" value="${quest ? escapeHtml(quest.id) : ''}">
    ${suggestions}
    <label>Quest title<input name="title" type="text" maxlength="80" required value="${quest ? escapeHtml(quest.title) : ''}" placeholder="Name this undertaking"></label>
    <label>Description<textarea name="description" maxlength="300" rows="3" placeholder="Add a brief account">${quest ? escapeHtml(quest.description) : ''}</textarea></label>
    <div class="form-grid">
      <label>Category<select name="category">${['Daily Quest','Main Quest','Side Quest','Guild Quest','Challenge'].map(v => `<option ${quest?.category === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>Difficulty<select name="difficulty">${['Easy','Normal','Hard','Legendary'].map(v => `<option value="${v}" ${quest?.difficulty === v ? 'selected' : (v === 'Normal' && !quest ? 'selected' : '')}>${v} - ${XP_REWARDS[v]} XP</option>`).join('')}</select></label>
      <label>Attribute<select name="attribute">${['Strength','Intelligence','Wisdom','Dexterity','Vitality','Discipline'].map(v => `<option ${quest?.attribute === v ? 'selected' : (!quest && v === 'Discipline' ? 'selected' : '')}>${v}</option>`).join('')}</select></label>
    </div>
    <div class="modal-actions"><button class="button button-ghost" id="cancelModal" type="button">Cancel</button><button class="button button-primary" type="submit">${quest ? 'Save Changes' : 'Record Quest'}</button></div>`;
  document.querySelector('#modalTitle').textContent = quest ? 'Edit Quest' : 'New Quest';
  modalBackdrop.hidden = false;
  questForm.querySelectorAll('[data-quest-template]').forEach(button => button.addEventListener('click', () => {
    const template = questTemplates[Number(button.dataset.questTemplate)];
    if (!template) return;
    questForm.elements.title.value = template.title;
    questForm.elements.description.value = template.description;
    questForm.elements.category.value = template.category;
    questForm.elements.difficulty.value = template.difficulty;
    questForm.elements.attribute.value = template.attribute;
    questForm.querySelectorAll('[data-quest-template]').forEach(option => {
      const selected = option === button;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
  }));
  document.querySelector('#cancelModal').addEventListener('click', closeModal);
  document.querySelector('#closeModal').addEventListener('click', closeModal);
  questForm.onsubmit = submitQuest;
  (questForm.querySelector('[data-quest-template]') || questForm.elements.title).focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  questForm.onsubmit = submitQuest;
}

function submitQuest(event) {
  event.preventDefault();
  const data = new FormData(questForm);
  const id = data.get('id');
  const title = data.get('title').trim();
  if (!title) return;
  if (id) {
    const quest = state.quests.find(q => q.id === id);
    if (!quest) return;
    Object.assign(quest, { title, description: data.get('description').trim(), category: data.get('category'), difficulty: data.get('difficulty'), attribute: data.get('attribute') });
    addChronicle('quest-edited', `The account of "${title}" was revised.`);
  } else {
    const quest = { id: uid(), title, description: data.get('description').trim(), category: data.get('category'), difficulty: data.get('difficulty'), attribute: data.get('attribute'), status: 'active', createdDate: new Date().toISOString(), completionDate: null };
    state.quests.unshift(quest);
    addChronicle('quest-created', `A new quest was recorded: "${title}".`, quest.id);
  }
  persist();
  closeModal();
  notify(id ? 'Quest revised' : 'Quest recorded', title);
}

function toggleQuest(id) {
  const quest = state.quests.find(q => q.id === id);
  if (!quest) return;
  if (quest.status === 'completed') {
    quest.status = 'active';
    quest.completedDate = null;
    addChronicle('quest-reopened', `"${quest.title}" was reopened.`);
    persist();
    notify('Quest reopened', quest.title);
    return;
  }
  quest.status = 'completed';
  quest.completedDate = new Date().toISOString();
  let levels = [];
  if (!quest.xpAwarded) {
    levels = awardXp(state.character, XP_REWARDS[quest.difficulty]);
    quest.xpAwarded = true;
    state.character.attributes[quest.attribute] = (state.character.attributes[quest.attribute] || 0) + 1;
    updateStreak(state.streak);
    addChronicle('quest-completed', `"${quest.title}" was completed. ${XP_REWARDS[quest.difficulty]} XP earned.`, quest.id);
  } else {
    addChronicle('quest-completed', `"${quest.title}" was completed again and retained its existing XP reward.`, quest.id);
  }
  levels.forEach(level => {
    state.character.title = level >= 10 ? 'Veteran' : level >= 5 ? 'Stalwart' : 'Sellsword';
    addChronicle('level-gained', `${state.character.name} reached level ${level}.`);
    notify('Level gained', `Level ${level} reached`);
  });
  checkAchievements();
  checkLevelReward(levels);
  persist();
  notify('Quest completed', `+${XP_REWARDS[quest.difficulty]} XP earned`);
}

function checkAchievements() {
  ACHIEVEMENTS.forEach(achievement => {
    if (state.achievements.includes(achievement.id)) return;
    if (achievementProgress(state, achievement) >= achievement.target) {
      state.achievements.push(achievement.id);
      addChronicle('achievement', `Achievement unlocked: ${achievement.name}.`);
      notify('Achievement unlocked', achievement.name, 'gold');
    }
  });
}

function checkLevelReward(levels) {
  if (!levels.length) return;
  levels.forEach(() => {
    const item = {
      id: uid(),
      name: 'Wayfarer\'s Charm',
      description: 'A small brass charm bearing the mark of the road.',
      type: 'Collectible',
      rarity: 'Uncommon',
      icon: 'charm',
      acquiredDate: new Date().toISOString(),
      quantity: 1
    };
    state.inventory.push(item);
    addChronicle('item-received', `${item.name} was added to the inventory.`);
  });
}

function deleteQuest(id) {
  const quest = state.quests.find(q => q.id === id);
  if (!quest) return;
  openConfirmModal('Delete quest', `Remove "${quest.title}" from the ledger?`, () => {
    state.quests = state.quests.filter(q => q.id !== id);
    addChronicle('quest-deleted', `"${quest.title}" was removed from the quest ledger.`);
    persist();
    closeModal();
    notify('Quest removed', quest.title);
  });
}

function openConfirmModal(title, message, confirmAction) {
  document.querySelector('#modalTitle').textContent = title;
  questForm.innerHTML = `<p class="reset-warning">${escapeHtml(message)}</p><div class="modal-actions"><button class="button button-ghost" id="cancelModal" type="button">Cancel</button><button class="button button-danger" type="submit">Confirm</button></div>`;
  modalBackdrop.hidden = false;
  document.querySelector('#cancelModal').addEventListener('click', closeModal);
  document.querySelector('#closeModal').addEventListener('click', closeModal);
  questForm.onsubmit = event => { event.preventDefault(); confirmAction(); };
}

function bindDynamicActions() {
  document.querySelectorAll('[data-add-quest]').forEach(button => button.addEventListener('click', () => openQuestModal()));
  document.querySelectorAll('[data-page-link]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.pageLink)));
  document.querySelectorAll('[data-toggle-quest]').forEach(button => button.addEventListener('click', () => toggleQuest(button.dataset.toggleQuest)));
  document.querySelectorAll('[data-edit-quest]').forEach(button => button.addEventListener('click', () => {
    openQuestModal(state.quests.find(q => q.id === button.dataset.editQuest));
  }));
  document.querySelectorAll('[data-delete-quest]').forEach(button => button.addEventListener('click', () => deleteQuest(button.dataset.deleteQuest)));
}

function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item[data-page]').forEach(button => {
    const active = button.dataset.page === page;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  document.querySelector('#sidebar').classList.remove('open');
  document.querySelector('#menuButton').setAttribute('aria-expanded', 'false');
  const renderers = { hall: renderHall, quests: renderQuests, character: renderCharacter, inventory: renderInventory, achievements: renderAchievements, chronicle: renderChronicle, settings: renderSettings };
  (renderers[page] || renderHall)();
  content.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  navigate(currentPage);
}

document.querySelectorAll('.nav-item[data-page]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
document.querySelector('#quickAddButton').addEventListener('click', () => openQuestModal());
document.querySelector('#menuButton').addEventListener('click', () => {
  const open = document.querySelector('#sidebar').classList.toggle('open');
  document.querySelector('#menuButton').setAttribute('aria-expanded', String(open));
});
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});
document.documentElement.classList.toggle('reduced-motion', state.settings.reducedMotion);
updateChrome();
render();
