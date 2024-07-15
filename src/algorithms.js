/**
 * @typedef {{
 * name: string,
 * getKortScore: (word: string) => number | string,
 * }} KortScoreConfig
 */

const primes = [
  2,
  3,
  5,
  7,
  11,
  13,
  17,
  19,
  23,
  29,
  31,
  37,
  41,
  43,
  47,
  53,
  59,
  61,
  67,
  71,
  73,
  79,
  83,
  89,
  97,
  101,
].map(number => BigInt(number));

/**
 * @type {Record<string, KortScoreConfig>}
 */
export const configs = {
  "add": {
    name: 'add',
    getKortScore(word) {
      /** @type {(a: number, b: number) => number} */
      return word.split("").map(character => character.charCodeAt(0)).reduce((a, b) => a + b, 0);
    },
  },
  "multiply": {
    name: 'multiply',
    getKortScore(word) {
      /** @type {(a: number, b: number) => number} */
      return word.split("").map(character => character.charCodeAt(0)).reduce((a, b) => a * b, 1);
    },
  },
  "xor-madness": {
    name: 'xor-madness',
    getKortScore(word) {
      const vector = new Array(26).fill(0);
      word.split("").map(character => character.charCodeAt(0) - 97).forEach(letterIndex => {
        vector[letterCharCode] ^= 1;
      });

      return vector.join("");
    },
  },
  "actual-solution": {
    name: 'actual_solution',
    getKortScore(word) {
      const vector = new Array(26).fill(0);
      word.split("").map(character => character.charCodeAt(0) - 97).forEach(letterIndex => {
        vector[letterCharCode] += 1;
      });

      return vector.join("");
    },
  },
  "insane-base-n": {
    name: 'insane-base-n',
    getKortScore(word) {
      const MAX_REPEATED_LETTERS = 26;

      let total = BigInt(0);
      word.split("").map(character => character.charCodeAt(0) - 97).forEach(letterIndex => {
        total += BigInt(Math.pow(MAX_REPEATED_LETTERS, letterIndex));
      });

      return total;
    },
  },
  "primes": {
    name: "primes",
    getKortScore(word) {
      let total = BigInt(1);
      word.split("").map(character => character.charCodeAt(0) - 97).forEach(letterIndex => {
        total *= primes[letterIndex];
      });

      return total;
    },
  },
};
