// @ts-check
import { writeFile } from 'node:fs/promises';
import { Words } from "./wordlist.js";
import { configs } from './algorithms.js';

const operationName = process.argv[2];
const operation = configs[operationName];
if (!operation) {
  console.error(`No known Kortscore algorithm with name ${operationName}. Exiting.`);
  process.exit(1);
}

/** @type {Map<number | string, string[]>} */
const scoreToWords = new Map();
Words.forEach((word) => {
  const score = operation.getKortScore(word);
  const current = scoreToWords.get(score) || [];
  scoreToWords.set(score, [...current, word]);
});

const entriesWithMultipleWords = Array.from(scoreToWords)
.sort((a, b) => {
  return b[1].length - a[1].length;
})
.filter(([score, words]) => {
  return words.length > 1;
});

const formattedOutput = entriesWithMultipleWords.map(([score, words]) => {
  /** @type {Map<string, number>} */
  const sortedWordToCount = new Map();
  /** @type {Map<number, number>} */
  const wordLengthToCount = new Map();

  words.forEach(word => {
    const sortedWord = word.split("").sort().join("");
    const current = sortedWordToCount.get(sortedWord) || 0;
    sortedWordToCount.set(sortedWord, current);

    const wordLength = word.length;
    const currentWordLength = wordLengthToCount.get(wordLength) || 0;
    wordLengthToCount.set(wordLength, currentWordLength);
  });
  const numAnagramGroups = sortedWordToCount.size;
  const numWordLengths = wordLengthToCount.size;

  const wordText = words.map(word => `        ${word}`).join("\n");
  return `${score}\n    ${words.length} words\n    ${numAnagramGroups} anagram groups:\n    ${numWordLengths} distinct word lengths\n${wordText}`
}).filter(line => line.length).join("\n");

writeFile(`results/kortscore_${operation.name}.txt`, formattedOutput).then(() => {
  process.exit(0);
});
