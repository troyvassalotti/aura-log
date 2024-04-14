/** @format */

import {createSeriesSimple, DAYS, sortListByDayOfWeek} from "../lib/utils";
import {Base} from "./Base";

/**
 * @tag bar-chart
 * @summary Displays a bar chart.
 * @property {string} type - Either "bar" or "column" type of chart.
 */
export class BarChart extends Base {
	static properties = {
		...super.properties,
		type: {type: String},
	};

	constructor() {
		super();
		this.type = "bar";
	}

	/**
	 * Headache data transformed to store the date as a numeric value.
	 * @returns {number[]}
	 * @private
	 */
	get #values() {
		return Object.values(this._data).map((value) =>
			new Date(value.date).getDay(),
		);
	}

	/**
	 * All the days that a headache has occurred on.
	 * @returns {string[]}
	 * @private
	 */
	get #days() {
		return this.#values.map((value) => sortListByDayOfWeek(value));
	}

	/**
	 * De-duplicate the generated date values.
	 * @see #values
	 * @returns {number[]}
	 * @private
	 */
	get #unique() {
		return [...new Set(this.#values)].sort();
	}

	/**
	 * All the days now filtered to only include one of each.
	 * @returns {string[]}
	 * @private
	 */
	get #filteredDays() {
		return this.#unique.map((value) => sortListByDayOfWeek(value));
	}

	/**
	 * Chart options.
	 */
	get chartOptions() {
		return {
			chart: {
				type: this.type,
			},
			legend: {
				enabled: false,
			},
			series: [
				{
					name: "Headaches",
					data: createSeriesSimple(this.#filteredDays, this.#days),
				},
			],
			xAxis: {
				categories: DAYS,
				crosshair: true,
			},
			yAxis: {
				title: {
					text: "Headaches",
				},
			},
		};
	}
}

window.customElements.define("bar-chart", BarChart);
