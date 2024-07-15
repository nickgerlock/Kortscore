/**
 * @typedef {{
 * name: string,
 * getKortScore: (word: string) => number | string,
 * }} KortScoreConfig
 */

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
      word.split("").map(character => character.charCodeAt(0) - 97).forEach(letterCharCode => {
        vector[letterCharCode] ^= 1;
      });

      return vector.join("");
    },
  },
  "actual-solution": {
    name: 'actual_solution',
    getKortScore(word) {
      const vector = new Array(26).fill(0);
      word.split("").map(character => character.charCodeAt(0) - 97).forEach(letterCharCode => {
        vector[letterCharCode] += 1;
      });

      return vector.join("");
    },
  },
};
