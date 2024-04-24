/** @format */

import {css} from "lit";

const reset = css`
	:host {
		box-sizing: border-box;
		display: block;
		font-family: system-ui;
	}

	*,
	*::after,
	*::before {
		box-sizing: inherit;
	}

	* {
		margin: 0;
	}
`;

export default reset;
