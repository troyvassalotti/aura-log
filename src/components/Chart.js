/** @format */

import {html} from "lit";
import AuraLogElement from "./AuraLogElement.js";

export default class Chart extends AuraLogElement {
	/**
	 * Chart container element.
	 * @returns {HTMLElement}
	 */
	get chartContainer() {
		return this.renderRoot.querySelector("#container");
	}

	render() {
		return html` <div id="container"></div> `;
	}
}
