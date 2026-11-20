# QuestHaven

QuestHaven is a medieval fantasy RPG-inspired productivity app. Turn everyday tasks into quests, earn XP, build streaks, and keep a chronicle of your progress.

**Live app:** [QuestHaven](https://namahka.github.io/QuestLog/)

## Install on a device

QuestHaven can be added to a device's home screen from its HTTPS GitHub Pages URL.

- **iPhone or iPad:** In Safari, tap **Share** → **Add to Home Screen** and leave **Open as Web App** enabled.
- **Android:** In Chrome, open the menu and choose **Install app**. **Add to Home screen** can create a regular browser shortcut instead.

The installed app opens without browser controls and caches its app shell for offline use. Quest progress remains stored locally in the browser.

## Features

- Create, edit, complete, reopen, delete, search, and filter quests.
- Earn XP and level up; completing quests also advances character attributes and streaks.
- Unlock achievements and collect level-up rewards.
- View your inventory, write personal diary pages, and browse a separate adventure-event log.
- Choose from built-in character portraits or upload a custom PNG, JPEG, or WebP portrait (up to 1 MB).
- Customize your character and preferences.
- Responsive layout for desktop, tablet, and mobile.

## Development

The app uses HTML, SCSS/CSS, vanilla JavaScript modules, and local storage. It has no application build system or runtime dependencies.

Styles are authored in [`styles/main.scss`](styles/main.scss). GitHub Pages serves the committed compiled stylesheet at [`styles/main.css`](styles/main.css); after changing SCSS, compile it with Dart Sass:


Main application files:

- [`index.html`](index.html) — semantic app shell and shared modal.
- [`scripts/main.js`](scripts/main.js) — navigation, rendering, and user interactions.
- [`scripts/storage/storage.js`](scripts/storage/storage.js) — local save data.
- [`scripts/systems/`](scripts/systems/) — progression, streak, and achievement rules.
- [`assets/images/realm.svg`](assets/images/realm.svg) — illustrated world background.

