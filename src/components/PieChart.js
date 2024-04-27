/** @format */

import {createSeriesSimple, uniqueSorted} from "../lib/utils";
import {Base} from "./Base";

/**
 * @tag pie-chart
 * @summary Displays a pie chart.
 * @property {string} logdata - The dataset from each log to display.
 */
export class PieChart extends Base {
	static properties = {
		...super.properties,
		logdata: {type: String},
	};

	constructor() {
		super();
		this.logdata;
	}

	createChartData() {
		let values = [];

		if (this.logdata) {
			values = Object.values(this._data)
				.map((value) => value[this.logdata])
				.flat(Infinity);
		}

		const unique = uniqueSorted(values);

		return createSeriesSimple(unique, values);
	}

	get chartOptions() {
		return {
			accessibility: {
				point: {
					valueSuffix: "%",
				},
			},
			chart: {
				type: "pie",
			},
			legend: {
				labelFormatter() {
					return `${this.name}: <b>${Math.round(this.percentage)}%</b>`;
				},
			},
			plotOptions: {
				pie: {
					innerSize: "50%",
					showInLegend: true,
				},
				series: {
					states: {
						hover: {
							halo: false,
						},
					},
				},
			},
			series: [
				{
					name: this.logdata,
					colorByPoint: true,
					data: this.createChartData(),
				},
			],
			tooltip: {
				pointFormat: "Count: <b>{point.y}</b>",
			},
		};
	}
}

window.customElements.define("pie-chart", PieChart);
