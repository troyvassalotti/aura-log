/** @format */

import {
	createSeriesSimple,
	DAYS,
	sortListByDayOfWeek,
	uniqueSorted,
} from "../lib/utils";
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

	createChartData() {
		const data = Object.values(this._data);
		const values = data.map((value) => new Date(value.date).getDay());
		const unique = uniqueSorted(values);

		const days = values.map((value) => sortListByDayOfWeek(value));
		const filteredDays = unique.map((value) => sortListByDayOfWeek(value));

		return createSeriesSimple(filteredDays, days);
	}

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
					data: this.createChartData(),
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
