import { ChartOptions } from "highcharts";
import { css } from "lit";
import { createSeriesSimple } from "../../lib/utils";
import { Base } from "./Base";

/**
 * @tag pie-chart
 * @summary Displays a pie chart.
 * @property {string} logdata - The dataset from each log to display.
 */
export class PieChart extends Base {
	static properties = {
		...super.properties,
		logdata: { type: String },
		disableLabels: { type: Boolean },
		disableLegend: { type: Boolean },
	};

	constructor() {
		super();
		this.logdata;
		this.disableLabels = false;
		this.disableLegend = false;
	}

	static styles = [
		super.styles,
		css`
		:host {
			--chart-height: 50vh;
		}
		`,
	];

	/**
	 * Headache data filtered by the component's logdata.
	 * @returns {FlatArray<*[], 1>[]}
	 * @private
	 */
	get #values() {
		if (this.logdata) {
			return Object.values(this._data)
				.map((value) => value[this.logdata])
				.flat();
		}
	}

	/**
	 * De-duplicate the generated values
	 * @see #values
	 * @returns {*[]}
	 * @private
	 */
	get #unique() {
		return [...new Set(this.#values)].sort();
	}

	/**
	 * Chart options.
	 * @type {ChartOptions}
	 */
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
				enabled: !this.disableLegend,
				labelFormatter: function() {
					return `${this.name}: <b>${Math.round(this.percentage)}%</b>`;
				},
			},
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: !this.disableLabels,
					},
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
					data: createSeriesSimple(this.#unique, this.#values),
				},
			],
			tooltip: {
				pointFormat: "Count: <b>{point.y}</b>",
			},
		};
	}
}

window.customElements.define("pie-chart", PieChart);
