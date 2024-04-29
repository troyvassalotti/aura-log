/** @format */

import {LitElement, css} from "lit";

export default class AuralogElement extends LitElement {
	static properties = {
		data: {state: true},
	};

	constructor() {
		super();
		this.data = [];
	}

	static styles = css`
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

		/* Improve media defaults */
		img,
		picture,
		video,
		canvas,
		svg {
			block-size: auto;
			display: block;
			max-inline-size: 100%;
		}

		/* Remove built-in form typography styles */
		input,
		button,
		textarea,
		select {
			font: inherit;
		}

		/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
		@media (prefers-reduced-motion: reduce) {
			html:focus-within {
				scroll-behavior: auto;
			}

			*,
			*::before,
			*::after {
				animation-duration: 0.01ms !important;
				animation-iteration-count: 1 !important;
				transition-duration: 0.01ms !important;
				scroll-behavior: auto !important;
			}
		}
	`;
}
