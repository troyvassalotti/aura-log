/** @format */

import { mode } from "d3";
import {Base} from "./Base";

/**
 * @tag histogram-chart
 * @summary Displays a histogram chart.
 */
export class HistogramChart extends Base {
	constructor() {
		super();
	}

	/**
	 * Values to chart.
	 * @returns {number[]}
	 */
	get #values() {
		return Object.values(this._data).map((value) =>
			new Date(value.date).getHours(),
		);
	}

	/**
	 * The mode hour period where headaches happened.
	 * @returns {number}
	 */
	get #topHour() {
		return mode(this.#values, undefined);
	}

	/**
	 * Chart options.
	 */
	get chartOptions() {
		return {
			caption: {
				text: `Worst Time of the Day? Between ${this.#topHour}:00-${
					this.#topHour + 1
				}:00
        ${this.#topHour + 1 >= 12 ? "p.m." : "a.m."}`,
			},
			plotOptions: {
				histogram: {
					accessibility: {
						point: {
							valueDescriptionFormat:
								"{index}. {point.x:.3f} to {point.x2:.3f}, {point.y}.",
						},
					},
					binsNumber: "sturges",
				},
				scatter: {
					tooltip: {
						pointFormat:
							"Headache No. <b>{point.x}</b><br/>Hour: <b>{point.y}</b>",
					},
				},
			},
			series: [
				{
					name: "Headaches",
					type: "histogram",
					xAxis: 1,
					yAxis: 1,
					baseSeries: "s1",
				},
				{
					name: "Time",
					type: "scatter",
					data: this.#values,
					id: "s1",
					marker: {
						radius: 2.5,
					},
				},
			],
			xAxis: [
				{
					title: {text: "Headache Count"},
					opposite: true,
				},
				{
					title: {text: "Hourly Block"},
				},
			],
			yAxis: [
				{
					title: {text: "Hour"},
					opposite: true,
				},
				{
					title: {text: "Headaches"},
				},
			],
		};
	}
}

window.customElements.define("histogram-chart", HistogramChart);
