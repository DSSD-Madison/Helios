// Adapted from: https://github.com/cfj/short-number/blob/master/index.js

const shortenNum = (num) => {
  if (typeof num !== "number" || Math.abs(num) < 1000) {
    return [num, ""];
  }

  let shortNumber;
  let exponent;
  let size;
  let sign = num < 0 ? "-" : "";
  const suffixes = {
    K: 6,
    M: 9,
    B: 12,
    T: 16,
  };

  num = Math.abs(num);
  size = Math.floor(num).toString().length;

  exponent = size % 3 === 0 ? size - 3 : size - (size % 3);
  shortNumber = Math.round(100 * (num / Math.pow(10, exponent))) / 100;

  let numSuffix = "";
  for (let suffix in suffixes) {
    if (exponent < suffixes[suffix]) {
      numSuffix = suffix;
      break;
    }
  }

  return [sign + shortNumber, numSuffix];
};

export default shortenNum;
