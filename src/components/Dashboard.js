/** @format */

import Highcharts from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import Histogram from "highcharts/modules/histogram-bellcurve";
import {mode} from "d3";
import {html, css} from "lit";
import AuralogElement from "./AuralogElement.js";
import "./Heatmap.js";
import {
	uniqueSorted,
	sortListByDayOfWeek,
	createSeriesSimple,
	DAYS,
} from "../lib/utils.js";

Accessibility(Highcharts);
Histogram(Highcharts);

export default class Dashboard extends AuralogElement {
	static get styles() {
		return [
			super.styles,
			css`
				:host,
				.row {
					display: grid;
					gap: 1rem;
				}

				.stack {
					display: flex;
					flex-direction: column;
					gap: 1rem;
				}

				.cell {
					--shadow-color: 4, 9, 20;
					--shadow-opacity: 0.03;

					border-radius: 4px;
					box-shadow:
						0 0.4688rem 2.1875rem
							rgba(var(--shadow-color), var(--shadow-opacity)),
						0 0.9375rem 1.4063rem
							rgba(var(--shadow-color), var(--shadow-opacity)),
						0 0.25rem 0.5313rem rgba(var(--shadow-color), var(--shadow-opacity)),
						0 0.125rem 0.1875rem
							rgba(var(--shadow-color), var(--shadow-opacity));
					padding: 1rem;
				}

				@media (width >= 768px) {
					.row {
						grid-row: auto / span var(--row-span, 1);
						grid-template-columns: repeat(6, 1fr);

						&.span-2 {
							--row-span: 2;
						}

						&.span-3 {
							--row-span: 3;
						}

						&.span-4 {
							--row-span: 4;
						}
					}

					.column {
						grid-column: auto / span var(--col-span, 1);

						&.span-2 {
							--col-span: 2;
						}

						&.span-3 {
							--col-span: 3;
						}

						&.span-4 {
							--col-span: 4;
						}

						&.span-5 {
							--col-span: 5;
						}

						&.span-6 {
							--col-span: 6;
						}
					}
				}
			`,
		];
	}

	createBarChartData() {
		const values = this.data.map((value) => new Date(value.date).getDay());
		const unique = uniqueSorted(values);
		const days = values.map((value) => sortListByDayOfWeek(value));
		const filteredDays = unique.map((value) => sortListByDayOfWeek(value));

		return createSeriesSimple(filteredDays, days);
	}

	createPieChartData(category) {
		let values = category
			? this.data.map((value) => value[category]).flat(Infinity)
			: [];

		const unique = uniqueSorted(values);

		return createSeriesSimple(unique, values);
	}

	createHistogramData() {
		const values = this.data.map((value) => new Date(value.date).getHours());
		return {
			data: values,
			topHour: mode(values),
		};
	}

	query(selector) {
		return this.renderRoot.querySelector(selector);
	}

	render() {
		return html`
			<div class="row">
				<div class="column cell span-6">
					<heat-map .data=${this.data}></heat-map>
				</div>
			</div>
			<div class="row">
				<div
					class="column cell span-3"
					id="bar"></div>
				<div
					class="column cell span-3"
					id="triggers"></div>
			</div>
			<div class="row">
				<div class="column stack span-2">
					<div
						class="cell"
						id="sleep"></div>
					<div
						class="cell"
						id="pain-areas"></div>
				</div>
				<div
					class="column cell span-4"
					id="histogram"></div>
			</div>
			<div class="row">
				<div
					class="column cell span-3"
					id="medications"></div>
				<div
					class="column cell span-3"
					id="symptoms"></div>
			</div>
		`;
	}

	firstUpdated() {
		const barChartContainer = this.query("#bar");
		const histogramContainer = this.query("#histogram");
		const pieChartTriggersContainer = this.query("#triggers");
		const pieChartSleepContainer = this.query("#sleep");
		const pieChartPainAreasContainer = this.query("#pain-areas");
		const pieChartMedicationsContainer = this.query("#medications");
		const pieChartSymptomsContainer = this.query("#symptoms");
		const {topHour, data: histogramData} = this.createHistogramData();

		Highcharts.setOptions({
			chart: {
				animation: false,
				style: {
					fontFamily: "inherit",
				},
			},
			credits: {
				enabled: false,
			},
			legend: {
				alignColumns: false,
			},
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: false,
					},
				},
				series: {
					states: {
						hover: {
							halo: false,
						},
					},
				},
			},
			responsive: {
				rules: [
					{
						condition: {
							minWidth: 400,
						},
						chartOptions: {
							plotOptions: {
								pie: {
									dataLabels: {
										distance: 10,
										enabled: true,
									},
								},
							},
						},
					},
				],
			},
		});

		Highcharts.chart(barChartContainer, {
			chart: {
				type: "column",
			},
			legend: {
				enabled: false,
			},
			series: [
				{
					name: "Headaches",
					data: this.createBarChartData(),
				},
			],
			title: {
				text: "Migraines by Day of Week",
			},
			xAxis: {
				categories: DAYS,
				crosshair: true,
			},
			yAxis: {
				title: {
					text: "Occurrences",
				},
			},
		});

		Highcharts.chart(histogramContainer, {
			caption: {
				text: `By analyzing the times of each migraine, the hour of the day where migraine onset is most frequent is between <b>${topHour}:00-${topHour + 1}:00
        ${topHour + 1 >= 12 ? "p.m." : "a.m."}</b>`,
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
					baseSeries: "s1",
					name: "Headaches",
					type: "histogram",
					xAxis: 1,
					yAxis: 1,
				},
				{
					data: histogramData,
					id: "s1",
					marker: {
						radius: 2.5,
					},
					name: "Time",
					type: "scatter",
				},
			],
			subtitle: {
				text: "Buckets of time are chunked in sizes of 4.",
			},
			title: {
				text: "Migraines by Hour of Day",
			},
			xAxis: [
				{
					opposite: true,
					title: {text: "Headache Count"},
				},
				{
					title: {text: "Hourly Block"},
				},
			],
			yAxis: [
				{
					opposite: true,
					title: {text: "Hour"},
				},
				{
					title: {text: "Headaches"},
				},
			],
		});

		Highcharts.chart(pieChartTriggersContainer, {
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
			},
			series: [
				{
					name: "Triggers",
					colorByPoint: true,
					data: this.createPieChartData("triggers"),
				},
			],
			title: {
				text: "Possible Triggers",
			},
			tooltip: {
				pointFormat: "Count: <b>{point.y}</b>",
			},
		});

		Highcharts.chart(pieChartPainAreasContainer, {
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
			},
			series: [
				{
					name: "Pain Areas",
					colorByPoint: true,
					data: this.createPieChartData("pain_areas"),
				},
			],
			title: {text: "Where Pain Was Felt"},
			tooltip: {
				pointFormat: "Count: <b>{point.y}</b>",
			},
		});

		Highcharts.chart(pieChartSleepContainer, {
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
					const name = this.name ? "In Sleep" : "While Awake";
					return `${name}: <b>${Math.round(this.percentage)}%</b>`;
				},
			},
			plotOptions: {
				pie: {
					dataLabels: {
						formatter() {
							const {
								point: {name},
							} = this;
							const label = name ? "In Sleep" : "While Awake";
							return label;
						},
					},
					innerSize: "50%",
					showInLegend: true,
				},
			},
			series: [
				{
					name: "In Sleep vs. While Awake",
					colorByPoint: true,
					data: this.createPieChartData("sleep"),
				},
			],
			title: {
				text: "Onset Period",
			},
			tooltip: {
				headerFormat: "",
				pointFormat: "Count: <b>{point.y}</b>",
			},
		});

		Highcharts.chart(pieChartSymptomsContainer, {
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
			},
			series: [
				{
					name: "Symptoms",
					colorByPoint: true,
					data: this.createPieChartData("symptoms"),
				},
			],
			title: {
				text: "Symptoms Experienced",
			},
			tooltip: {
				pointFormat: "Count: <b>{point.y}</b>",
			},
		});

		Highcharts.chart(pieChartMedicationsContainer, {
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
			},
			series: [
				{
					name: "Medications",
					colorByPoint: true,
					data: this.createPieChartData("medications"),
				},
			],
			title: {
				text: "Medications Used",
			},
			tooltip: {
				pointFormatter() {
					return `<b>${this.y} / ${Math.round(this.percentage)}%</b>`;
				},
			},
		});
	}
}

window.customElements.define("dash-board", Dashboard);
