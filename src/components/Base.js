/** @format */

import Highcharts from "highcharts";
import {merge} from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import Histogram from "highcharts/modules/histogram-bellcurve";
import {css, html, LitElement} from "lit";

// Apply Highcharts modules
Accessibility(Highcharts);
Histogram(Highcharts);

/**
 * @class Base class from which all components extend.
 * @property {Record<any>[]} _data - Overall headache data.
 * @property {string} chartTitle - The title of the chart as `chart-title` attribute.
 * @property {string} lib - The charting library used to create the chart.
 * @property {string} theme - Highcharts theme to apply to the chart.
 */
export class Base extends LitElement {
	static properties = {
		_data: {state: true},
		chartTitle: {type: String},
		chartSubtitle: {type: String},
		lib: {state: true},
	};

	constructor() {
		super();
		this._data = [];
		this.chartTitle = "";
		this.chartSubtitle = "";
		this.lib = "highcharts";
	}

	static get styles() {
		return [
			css`
				:host {
					box-sizing: border-box;
					display: block;
				}

				*,
				*::after,
				*::before {
					box-sizing: inherit;
				}

				* {
					margin: 0;
				}
			`,
		];
	}

	/**
	 * Chart container element.
	 * @returns {HTMLElement}
	 */
	get chartContainer() {
		return this.renderRoot.querySelector("#container");
	}

	/**
	 * Global options for Highcharts to use.
	 */
	get #globalOptions() {
		return {
			credits: {
				enabled: false,
			},
			subtitle: {
				text: this.chartSubtitle,
			},
			title: {
				text: this.chartTitle,
			},
		};
	}

	/**
	 * Chart options per chart.
	 * @abstract
	 */
	get chartOptions() {
		return {};
	}

	async connectedCallback() {
		const response = await fetch("/headaches.json");
		const data = await response.json();
		this._data = data;

		super.connectedCallback();
	}

	render() {
		return html`<div
			class="lib--${this.lib}"
			id="container"></div>`;
	}

	firstUpdated() {
		// Load the chart based on what library is being used
		if (this.lib === "highcharts") {
			Highcharts.chart(
				this.chartContainer,
				merge(this.#globalOptions, this.chartOptions),
			);
		} else {
			this._initChart();
		}
	}
}
