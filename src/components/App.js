/** @format */

import {css, html} from "lit";
import {Task} from "@lit/task";
import AuralogElement from "./AuralogElement.js";
import "./Dashboard.js";

export default class App extends AuralogElement {
	static properties = {
		appTitle: {type: String},
		src: {type: String},
	};

	static get styles() {
		return [
			super.styles,
			css`
				:host {
					padding: 1rem;
				}
			`,
		];
	}

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
				<header class="header">
					<h1>${this.appTitle}</h1>
					<p><a href="${this.src}">View raw data</a>.</p>
				</header>
				<main>
					<dash-board .data=${data}></dash-board>
				</main>
			`,
			error: (e) => html`<p>Error: ${e}</p>`,
		});
	}
}

window.customElements.define("aura-log", App);
