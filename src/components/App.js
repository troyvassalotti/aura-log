/** @format */

import {css, html} from "lit";
import {Task} from "@lit/task";
import AuralogElement from "./AuralogElement.js";
import "./Dashboard.js";
import "./LoadingSpinner.js";

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
					/* @link https://utopia.fyi/type/calculator?c=320,18,1.2,1240,20,1.25,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */
					--step--2: clamp(0.7813rem, 0.7747rem + 0.0326vi, 0.8rem);
					--step--1: clamp(0.9375rem, 0.9158rem + 0.1087vi, 1rem);
					--step-0: clamp(1.125rem, 1.0815rem + 0.2174vi, 1.25rem);
					--step-1: clamp(1.35rem, 1.2761rem + 0.3696vi, 1.5625rem);
					--step-2: clamp(1.62rem, 1.5041rem + 0.5793vi, 1.9531rem);
					--step-3: clamp(1.944rem, 1.771rem + 0.8651vi, 2.4414rem);
					--step-4: clamp(2.3328rem, 2.0827rem + 1.2504vi, 3.0518rem);
					--step-5: clamp(2.7994rem, 2.4462rem + 1.7658vi, 3.8147rem);

					/* @link https://utopia.fyi/space/calculator?c=320,18,1.2,1240,20,1.25,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,&g=s,l,xl,12 */
					--space-3xs: clamp(0.3125rem, 0.3125rem + 0vi, 0.3125rem);
					--space-2xs: clamp(0.5625rem, 0.5408rem + 0.1087vi, 0.625rem);
					--space-xs: clamp(0.875rem, 0.8533rem + 0.1087vi, 0.9375rem);
					--space-s: clamp(1.125rem, 1.0815rem + 0.2174vi, 1.25rem);
					--space-m: clamp(1.6875rem, 1.6223rem + 0.3261vi, 1.875rem);
					--space-l: clamp(2.25rem, 2.163rem + 0.4348vi, 2.5rem);
					--space-xl: clamp(3.375rem, 3.2446rem + 0.6522vi, 3.75rem);
					--space-2xl: clamp(4.5rem, 4.3261rem + 0.8696vi, 5rem);
					--space-3xl: clamp(6.75rem, 6.4891rem + 1.3043vi, 7.5rem);
				}

				.loading-body {
					font-size: var(--step-2);
				}

				.monospace {
					font-family: monospace;
				}

				main {
					padding: 1rem;
				}

				footer {
					font-size: var(--step-0);
					padding-block: 2rem;
					padding-inline: 1rem;
					text-align: center;
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
			pending: () => html`
				<main class="loading-body">
					<h1 class="monospace">Loading Aura Log...</h1>
					<loading-spinner></loading-spinner>
				</main>
			`,
			complete: (data) => html`
				<main>
					<dash-board .data=${data}></dash-board>
				</main>
				<footer>
					<h1>${this.appTitle}</h1>
					<p><a href="${this.src}">View raw data</a>.</p>
				</footer>
			`,
			error: (e) => html`<p>Error: ${e}</p>`,
		});
	}
}

window.customElements.define("aura-log", App);
