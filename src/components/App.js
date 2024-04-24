/** @format */

import {html} from "lit";
import {Task} from "@lit/task";
import AuraLogElement from "./AuraLogElement.js";
import "./Heatmap.js";

export default class App extends AuraLogElement {
	static properties = {
		src: {type: String},
		appTitle: {type: String},
	};

	dataTask = new Task(this, {
		task: async ([source], {signal}) => {
			const response = await fetch(source, {signal});

			if (!response.ok) {
				throw new Error(response.status);
			}

			return response.json();
		},
		args: () => [this.src],
	});

	render() {
		return this.dataTask.render({
			pending: () => html`<p>Loading Aura Log...</p>`,
			complete: (data) => html`
				<div id="app">
					<header class="header">
						<h1>${this.appTitle}</h1>
						<p><a href="${this.src}">View raw data</a>.</p>
					</header>
					<heat-map
						.data=${data}
						theme="blue"></heat-map>
				</div>
			`,
			error: (e) => html`<p>Error: ${e}</p>`,
		});
	}
}

window.customElements.define("aura-log", App);
