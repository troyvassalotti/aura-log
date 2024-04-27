/** @format */

import {mode} from "d3";
import {Base} from "./Base";

/**
 * @tag histogram-chart
 * @summary Displays a histogram chart.
 */
export class HistogramChart extends Base {
	constructor() {
		super();
	}

	get chartOptions() {
		const data = Object.values(this._data);
		const values = data.map((value) => new Date(value.date).getHours());
		const topHour = mode(values);

		return {
			caption: {
				text: `Worst Time of the Day? Between ${topHour}:00-${topHour + 1}:00
        ${topHour + 1 >= 12 ? "p.m." : "a.m."}`,
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
					data: values,
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
