/** @format */

import {html} from "lit";
import AuralogElement from "./AuralogElement.js";

export default class Chart extends AuralogElement {
	/**
	 * Chart container element.
	 * @returns {HTMLElement}
	 */
	get chartContainer() {
		return this.renderRoot.querySelector("#container");
	}

	/** @protected */
	render() {
		return html`<div id="container" class="highcharts-light"></div>`;
	}

	/** @abstract */
	init() {}

	/** @protected */
	firstUpdated() {
		this.init();
	}
}
