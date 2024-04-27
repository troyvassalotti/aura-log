/** @format */

import {html} from "lit";
import {Task} from "@lit/task";
import AuralogElement from "./AuralogElement.js";
import "./Heatmap.js";
import "./Dashboard.js";

export default class App extends AuralogElement {
	static properties = {
		src: {type: String},
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
						<slot name="title"></slot>
						<p><a href="${this.src}">View raw data</a>.</p>
					</header>
					<heat-map
						.data=${data}
						theme="blue"></heat-map>
					<dash-board .data=${data}></dash-board>
				</div>
			`,
			error: (e) => html`<p>Error: ${e}</p>`,
		});
	}
}

window.customElements.define("aura-log", App);
