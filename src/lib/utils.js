/** @format */

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
 * Count how many of a given argument are in an array.
 *
 * @param {any[]} array
 * @param {string | number} what
 * @returns {number} Total of that value in the array.
 */
function countInArray(array, what) {
	return array.filter((item) => item == what).length;
}

/**
 * Get the day name of the week by day number.
 *
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
 *
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

