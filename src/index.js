// @ts-check
import { writeFile } from 'node:fs/promises';
import { Words } from "./wordlist.js";

const configs = {
  "add": {
    name: 'add',
    getKortScore(word) {
      /** @type {(a: number, b: number) => number} */
      return word.split("").map(character => character.charCodeAt(0)).reduce((/** @type {any} */ a, /** @type {any} */ b) => a + b, 0);
    },
  },
  "multiply": {
    name: 'multiply',
    getKortScore(word) {
      /** @type {(a: number, b: number) => number} */
      return word.split("").map(character => character.charCodeAt(0)).reduce((/** @type {number} */ a, /** @type {number} */ b) => a * b, 0);
    },
  },
  "xor-madness": {
    name: 'xor-madness',
    getKortScore(word) {
      const vector = word.split("").map(character => character.charCodeAt(0) - 97).reduce((vector, letterCharCode) => {
        vector[letterCharCode] ^= 1;
        return vector;
      }, new Array(26).fill(0));

      return vector.join("");
    },
  },
};

const OPERATION = configs["xor-madness"];

/** @type {Map<number, string[]>} */
const scoreToWords = new Map();
Words.forEach((word, index) => {
  const score = OPERATION.getKortScore(word);
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

const formatted = entriesWithMultipleWords.map(([score, words]) => {
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

writeFile(`kortscore_${OPERATION.name}.txt`, formatted);
