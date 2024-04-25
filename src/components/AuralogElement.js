/** @format */

import {LitElement} from "lit";
import reset from "./reset.styles.js";

export default class AuralogElement extends LitElement {
	static properties = {
		data: {state: true},
	};

	constructor() {
		super();
		this.data = [];
	}

	static styles = reset;
}
