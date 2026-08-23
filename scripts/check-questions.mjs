// Structural and fairness checks for the question bank.
// Run with: npm run check:questions
import { ALL_QUESTIONS } from '../src/data/questions.js';
import { CATEGORIES } from '../src/data/categories.js';

const MAX_LENGTH_MARGIN = 10; // a correct answer this much longer than every
                              // distractor is a giveaway on its own
const MAX_STRATEGY_SUCCESS = 34; // percent, for "pick the obviously longest"
const VISIBLE_MARGIN = 4; // chars; below this a child cannot see the difference

const errors = [];
const normalize = (s) => s.replace(/[?"'.,!\s־\-()]/g, '');
const seen = new Map();

ALL_QUESTIONS.forEach((q, i) => {
  const at = `#${i} (id ${q.id}) "${q.question?.slice(0, 40)}"`;
  if (!q.question?.trim()) errors.push(`${at}: empty question`);
  if (!q.fact?.trim()) errors.push(`${at}: empty fact`);
  if (!CATEGORIES[q.category]) errors.push(`${at}: unknown category "${q.category}"`);
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push(`${at}: has ${q.options?.length} options, expected 4`);
    return;
  }
  if (new Set(q.options).size !== 4) errors.push(`${at}: duplicate options`);
  if (q.options.some((o) => !o?.trim())) errors.push(`${at}: blank option`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) {
    errors.push(`${at}: answer index ${q.answer} out of range`);
    return;
  }

  const key = normalize(q.question);
  if (seen.has(key)) errors.push(`${at}: duplicate of id ${seen.get(key)}`);
  else seen.set(key, q.id);

  const lengths = q.options.map((o) => o.length);
  const margin = lengths[q.answer] - Math.max(...lengths.filter((_, j) => j !== q.answer));
  if (margin >= MAX_LENGTH_MARGIN) {
    errors.push(
      `${at}: correct answer is ${margin} chars longer than every distractor - ` +
        `pad the distractors or shorten the answer`,
    );
  }
});

// Would "pick the option that is obviously longest, otherwise guess" beat chance?
let expected = 0;
let visible = 0;
for (const q of ALL_QUESTIONS) {
  const lengths = q.options.map((o) => o.length);
  const [longest, runnerUp] = [...lengths].sort((a, b) => b - a);
  if (longest - runnerUp >= VISIBLE_MARGIN) {
    visible++;
    expected += lengths[q.answer] === longest ? 1 : 0;
  } else {
    expected += 0.25;
  }
}
const success = (100 * expected) / ALL_QUESTIONS.length;

const answerSpread = [0, 1, 2, 3].map(
  (i) => ALL_QUESTIONS.filter((q) => q.answer === i).length,
);

console.log(`questions            ${ALL_QUESTIONS.length}`);
console.log(`answer index spread  ${answerSpread.join(' / ')}`);
console.log(`visible length tell  ${(100 * visible / ALL_QUESTIONS.length).toFixed(1)}% of questions`);
console.log(`guess-longest wins   ${success.toFixed(1)}%  (chance 25%, limit ${MAX_STRATEGY_SUCCESS}%)`);

if (success > MAX_STRATEGY_SUCCESS) {
  errors.push(
    `"pick the longest option" succeeds ${success.toFixed(1)}% of the time, ` +
      `above the ${MAX_STRATEGY_SUCCESS}% limit`,
  );
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  errors.slice(0, 40).forEach((e) => console.error('  ' + e));
  if (errors.length > 40) console.error(`  ... and ${errors.length - 40} more`);
  process.exit(1);
}
console.log('\nall checks passed');
