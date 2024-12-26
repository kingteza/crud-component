/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
const options = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};
const integerOptions = { minimumFractionDigits: 0, maximumFractionDigits: 0 };

function toMoney(num: number = 0) {
  return Number(+num).toLocaleString("en", options);
}

function roundNoNan(num: number = 0, pow = 2) {
  const value = round(num, pow);
  return isNaN(value) ? undefined : value;
}

function round(num: number = 0, pow = 2) {
  num = +num;

  if (typeof pow !== "number" || pow < 0) pow = 2;
  switch (pow) {
    case 0:
      return Math.round(num);
    case 1:
      return Math.round(num * 10) / 10;
    case 2:
      return Math.round(num * 100) / 100;
    case 3:
      return Math.round(num * 1000) / 1000;
    case 4:
      return Math.round(num * 10000) / 10000;
    default: {
      const p = Math.pow(10, pow);
      return Math.round(num * p) / p;
    }
  }
}

function toInt(num: number = 0, formatted = false) {
  const val = Math.floor(num);
  if (!formatted) return val.toString();
  return val.toLocaleString("en", integerOptions);
}

function randInt(max = 1000000000) {
  const randomInteger = Math.floor(Math.random() * (max + 1));
  return randomInteger;
}

export function withoutNan(value: number) {
  const val = Number(value);
  return !isNaN(val) ? val : 0;
}

// ... existing code ...

function removeTrailingZeros(num: number = 0): number {
  // Convert to string to handle decimal points
  const str = num.toString();

  // If no decimal point, return the original number
  if (!str.includes(".")) {
    return num;
  }

  // Remove trailing zeros and decimal point if all digits after it are zero
  const trimmed = str.replace(/\.?0+$/, "");

  return Number(trimmed);
}

export default {
  toInt,
  round,
  toMoney,
  randInt,
  withoutNan,
  removeTrailingZeros,
  roundNoNan,
};
