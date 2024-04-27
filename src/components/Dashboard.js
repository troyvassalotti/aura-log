/** @format */

import Highcharts from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import Histogram from "highcharts/modules/histogram-bellcurve";
import {mode} from "d3";
import {html, css} from "lit";
import AuralogElement from "./AuralogElement.js";
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
				.dashboard {
					display: grid;
					gap: 1rem;
				}

				.row {
					display: grid;
					gap: 1rem;
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
			<div class="dashboard">
				<div class="row">
					<div
						class="column span-3"
						id="bar"></div>
					<div
						class="column span-3"
						id="triggers"></div>
				</div>
				<div class="row">
					<div class="column span-2">
						<div id="sleep"></div>
						<div id="pain-areas"></div>
					</div>
					<div
						class="column span-4"
						id="histogram"></div>
				</div>
				<div class="row">
					<div
						class="column span-3"
						id="medications"></div>
					<div
						class="column span-3"
						id="symptoms"></div>
				</div>
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
			},
			credits: {
				enabled: false,
			},
			legend: {
				alignColumns: false,
			},
			plotOptions: {
				series: {
					states: {
						hover: {
							halo: false,
						},
					},
				},
			},
			title: {
				text: "",
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
			tooltip: {
				pointFormat: "Count: <b>{point.y}</b>",
			},
		});
	}
}

window.customElements.define("dash-board", Dashboard);
