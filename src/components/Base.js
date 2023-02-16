import Highcharts, { Chart } from "highcharts";
import { merge } from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import Histogram from "highcharts/modules/histogram-bellcurve";
import ThemeDarkBlue from "highcharts/themes/dark-blue";
import ThemeUnica from "highcharts/themes/dark-unica";
import ThemeHighContrastDark from "highcharts/themes/high-contrast-dark";
import ThemeSkies from "highcharts/themes/skies";
import { css, html, LitElement } from "lit";
import { HEADACHE_DATA } from "../../lib/utils";

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
		_data: { state: true },
		chartTitle: { type: String },
		chartSubtite: { type: String },
		lib: { state: true },
		theme: { type: String },
	};

	constructor() {
		super();
		this._data = HEADACHE_DATA;
		this.chartTitle = "";
		this.lib = "highcharts";
		this.theme = "high-contrast-dark";
	}

	static get styles() {
		return css`
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

      .lib--highcharts {
        block-size: clamp(400px, var(--chart-height, 75vh), 800px);
      }
    `;
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
	 * @returns {Chart}
	 */
	get #globalOptions() {
		return {
			chart: {
				style: {
					fontFamily: "system-ui",
				},
			},
			credits: {
				enabled: false,
			},
			subtitle: {
				text: this.chartSubtite,
			},
			title: {
				text: this.chartTitle,
			},
		};
	}

	/**
	 * Chart options per chart.
	 * @abstract
	 * @returns {Chart}
	 */
	get chartOptions() {
		return {};
	}

	/**
	 * Set Highcharts theme.
	 * @param {string} theme - Chosen theme for the chart.
	 * @returns {void}
	 */
	#setTheme(theme) {
		switch (theme) {
			case "high contrast":
				ThemeHighContrastDark(Highcharts);
				break;
			case "dark blue":
				ThemeDarkBlue(Highcharts);
				break;
			case "skies":
				ThemeSkies(Highcharts);
				break;
			case "unica":
				ThemeUnica(Highcharts);
				break;
			default:
				ThemeHighContrastDark(Highcharts);
		}
	}

	render() {
		return html`<div class="lib--${this.lib}" id="container"></div>`;
	}

	firstUpdated() {
		// Set theme after render
		this.#setTheme(this.theme);

		// Load the chart based on what library is being used
		if (this.lib === "highcharts") {
			Highcharts.chart(this.chartContainer, merge(this.#globalOptions, this.chartOptions));
		} else {
			this._initChart();
		}
	}
}
