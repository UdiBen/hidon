# חידון הידע הגדול לילדים

Hebrew (RTL) general-knowledge quiz for kids. 1,088 questions across 17 topics,
each with a follow-up fact. React + Vite + Tailwind v4.

## Run

```bash
npm install
npm run dev
```

`npm run build` for a production bundle, `npm run lint` for ESLint, and
`npm run check:questions` to validate the question bank.

## Layout

| Path | What |
| --- | --- |
| `src/data/questions.js` | The question bank. One flat array grouped by category with section comments. |
| `src/data/categories.js` | Category label, Lucide icon and chip colors per category key. |
| `src/components/` | `HomeScreen`, `QuizScreen`, `ResultScreen` plus the shared chip, blobs and confetti. |
| `src/lib/sound.js` | Web Audio sound effects — no audio assets. |
| `src/lib/storage.js` | Settings and personal records in `localStorage`. |
| `src/index.css` | Design tokens (`@theme`), the `clay` utilities and keyframes. |
| `public/manifest.webmanifest` | Web app manifest — installable to a phone home screen. |
| `public/sw.js` | Service worker: precaches the shell so the installed app opens offline. Bump `CACHE` to evict an older release. |
| `scripts/check-questions.mjs` | Validates the bank: structure, duplicates, and answer-length fairness. |

## Adding questions

Append to the right category block in `src/data/questions.js`:

```js
{ id: 990, category: "animals", question: "…?", options: ["…", "…", "…", "…"], answer: 0, fact: "…" },
```

Then run `npm run check:questions`. It enforces the rules the bank keeps:

- exactly 4 distinct options, `answer` is the index of the correct one
- every question has a `fact`, and no two questions repeat the same prompt
- **the correct answer must not stand out by length.** Write the distractors as
  specific and as long as the real answer. A precise answer paired with three
  throwaway stubs lets a child score by picking the longest option without
  reading the question, and the check fails the build when that gets exploitable.

Option order is reshuffled at runtime, so the position of the answer never matters.
