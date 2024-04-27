/** @format */

import Highcharts from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import Histogram from "highcharts/modules/histogram-bellcurve";
import highchartsCSS from "highcharts/css/highcharts.css?inline";
import {unsafeCSS, html} from "lit";
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
		return [super.styles, unsafeCSS(highchartsCSS)];
	}

	createBarChartData() {
		const data = Object.values(this.data);
		const values = data.map((value) => new Date(value.date).getDay());
		const unique = uniqueSorted(values);

		const days = values.map((value) => sortListByDayOfWeek(value));
		const filteredDays = unique.map((value) => sortListByDayOfWeek(value));

		return createSeriesSimple(filteredDays, days);
	}

	createPieChartData(category) {
		let values = category
			? Object.values(this.data)
					.map((value) => value[category])
					.flat(Infinity)
			: [];

		const unique = uniqueSorted(values);

		return createSeriesSimple(unique, values);
	}

	get barChartOptions() {
		return {
			chart: {
				type: "bar",
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
		};
	}

	get barChartContainer() {
		return this.renderRoot.querySelector("#bar");
	}

	render() {
		return html`
			<div class="dashboard highcharts-light">
				<div class="row">
					<div
						class="column"
						id="bar"></div>
				</div>
			</div>
		`;
	}

	firstUpdated() {
		Highcharts.chart(this.barChartContainer, this.barChartOptions);
	}
}

window.customElements.define("dash-board", Dashboard);
