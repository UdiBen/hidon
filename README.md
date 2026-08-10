# חידון הידע הגדול לילדים

Hebrew (RTL) general-knowledge quiz for kids. 989 questions across 17 topics, each
with a follow-up fact. React + Vite + Tailwind v4.

## Run

```bash
npm install
npm run dev
```

`npm run build` for a production bundle, `npm run lint` for ESLint.

## Layout

| Path | What |
| --- | --- |
| `src/data/questions.js` | The question bank. One flat array grouped by category with section comments. |
| `src/data/categories.js` | Category label, Lucide icon and chip colors per category key. |
| `src/components/` | `HomeScreen`, `QuizScreen`, `ResultScreen` plus the shared chip, blobs and confetti. |
| `src/lib/sound.js` | Web Audio sound effects — no audio assets. |
| `src/lib/storage.js` | Settings and personal records in `localStorage`. |
| `src/index.css` | Design tokens (`@theme`), the `clay` utilities and keyframes. |

## Adding questions

Append to the right category block in `src/data/questions.js`:

```js
{ id: 990, category: "animals", question: "…?", options: ["…", "…", "…", "…"], answer: 0, fact: "…" },
```

Rules the bank keeps: exactly 4 options, `answer` is the index of the correct one,
every question has a `fact`, and no two questions repeat the same prompt. Option
order is reshuffled at runtime, so the position of the correct answer never matters.
