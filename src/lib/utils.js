import { InternMap } from "internmap";

/** Months in the year. */
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Days in the week. */
export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Turn a value into a string and pad the start of it.
 * @param {string} value Value to turn into a string
 * @param {number} padCount Amount to pad
 * @param {string} padWith String to pad with
 * @returns {String}
 */
export function padString(value, padCount = 2, padWith = "0") {
  return value.toString().padStart(padCount, padWith);
}

/**
 * Get the day name of the week by day number.
 * @param {number} value - Number representing the day of the week with `Date.getDay();`
 * @returns {string[]}
 */
export function sortListByDayOfWeek(value) {
  if (value) {
    switch (value) {
      case 0:
        return DAYS[value];
      case 1:
        return DAYS[value];
      case 2:
        return DAYS[value];
      case 3:
        return DAYS[value];
      case 4:
        return DAYS[value];
      case 5:
        return DAYS[value];
      case 6:
        return DAYS[value];
    }
  }
}

/**
 * A Highcharts-compatible data structure with Name and Number of occurrences in the given data.
 * @param {any} set An array of unique values
 * @param {any} data The unfiltered dataset to compare against
 * @returns {any} Name-to-value pairings in an Array
 */
export function createSeriesSimple(set, data) {
  if (set && data) {
    const dataMap = set.map((value) => [value, countInArray(data, value)]);

    return dataMap.map((value) => {
      return {
        name: value[0],
        y: value[1],
      };
    });
  }
}

/**
 * Count how many of a given argument are in an array.
 * @param {any[]} array
 * @param {string | number} what
 * @returns {number} Total of that value in the array.
 */
export function countInArray(array, what) {
  return array.filter((item) => item == what).length;
}

/**
 * Find the mode of a given data set. Taken from D3 to remove deps.
 * @link https://github.com/d3/d3-array/blob/main/src/mode.js
 * @param {any} values
 * @param {any} valueof
 * @returns {number}
 */
export function mode(values, valueof) {
  const counts = new InternMap();

  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && value >= value) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && value >= value) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
  }

  let modeValue;
  let modeCount = 0;

  for (const [value, count] of counts) {
    if (count > modeCount) {
      modeCount = count;
      modeValue = value;
    }
  }

  return modeValue;
}
