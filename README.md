# The Applied AI Arcade

A booth-friendly arcade with two 30–60 second mini-games about Applied AI, a name prompt before each game, a 5-question Vienna quiz after it, and a results screen. Scores go to a SQLite database through a tiny Node server, so several devices can share one leaderboard. There are no accounts, and no external services or network calls.

- **Architect the Agent** – read a plain-language mission, plug parts into a harness around the model (drag, or tap then tap), then run a deterministic evaluation.
- **Find the Connection** – spot what links four clues; optional progressive hints.

Stack: Vite, React 19, TypeScript, Tailwind CSS v4, Motion, Lucide, Vitest, Oxlint, Node + SQLite.
(The repo was scaffolded with Vite, so it was kept rather than switching to Next.js.)

## Local setup

Requires Node 24+ (uses the built-in `node:sqlite`, so there are no extra dependencies).

```bash
npm install
npm run dev:all    # API on :3001 + Vite on :5173 (the dev server proxies /api)
npm run lint
npm run typecheck
npm test
```

## Running at the booth (one or two devices)

Run the server on **one** machine. It serves the app and the SQLite database (`data/arcade.db`, created automatically):

```bash
npm install
npm start          # builds, then serves on http://0.0.0.0:3001
```

Open `http://localhost:3001` on that machine, and `http://<that-machine's-LAN-IP>:3001` on the second device (same Wi-Fi/network). Both devices read and write the same leaderboard. Find the IP with `ipconfig getifaddr en0` (macOS) or `hostname -I` (Linux).

| Env var | Purpose | Default |
| --- | --- | --- |
| `PORT` | Server port | `3001` |
| `DB_PATH` | SQLite file location | `data/arcade.db` |
| `ADMIN_KEY` | Key needed to clear all scores from the Organizer panel | unset: only the server machine itself may clear |

Organizer tools are behind the small "Organizer" link on the leaderboard: export CSV (`/api/scores.csv`) and clear all scores. Back up by copying `data/arcade.db`. If the server is unreachable, games still play and the results screen says the score wasn't saved.

## Deployment

The app is a static build (`dist/`) plus the Node server in `server/`. Deploy both together to any host that runs Node 24 and has a persistent disk for the database file. Platforms with ephemeral filesystems will lose scores on restart.

## Adding content

All content is typed data, with no UI changes needed:

| Content | File |
| --- | --- |
| Harness scenarios (scoring rules, order rules, explanations) | `src/content/scenarios.ts` |
| Harness components | `src/content/components.ts` |
| Connection puzzles | `src/content/puzzles.ts` |
| Vienna quiz questions (and `QUIZ_LENGTH`, currently 5) | `src/content/bonus.ts` |

`src/lib/harness.test.ts` checks every scenario for consistency and that a perfect score is reachable, so mistakes in new content fail the tests.

## Picture puzzles

Picture ("rebus") puzzles show only pictures; players say them aloud to spell an AI term (corn + texting + Windows logo = "con" + "text" + "window" = Context Window). Put image files in `public/puzzles/` (PNG, JPG, SVG or WebP, ideally square, around 400px) and reference them in `src/content/puzzles.ts`:

```ts
tiles: [{ image: '/puzzles/corn.png', label: 'Corn' }, { image: '/puzzles/text.png', label: 'Someone texting' }]
```

`label` is alt text only and is never shown. Tiles without an `image` fall back to their emoji `glyph`. Use `caption` for a clue a picture can't carry, such as a quote. Make sure you have the rights to use any image you add.

## Scoring

Harness (0–100, deterministic): share of the mission's needs covered, −15 per unneeded part. Optional extras are never penalised, and order doesn't matter. Connection: 100, −25 per wrong guess, −10 per hint.

## Booth details

Drag-and-drop uses pointer events (mouse, pen and touch), with a tap-to-select fallback and full keyboard support. The app returns to the home screen after 3 minutes of inactivity. The player's name is held in memory during a visit and cleared on return to the home screen. It's stored only when the visitor finishes, as a leaderboard row (name, game, scores, time). Total = game score (0–100) + 20 per correct quiz answer (max 200), computed on the server.
