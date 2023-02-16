/**
 * @file Transforms markdown files to variables.
 */

import matter from "gray-matter";
import config from "../auralog.config";

/** Default options for the plugin. */
const pluginDefaults = {
	extensions: [".md"],
};

/**
 * Reads the contents of each log and outputs variables for use in the app.
 * @param {any} options User-defined plugin options
 * @returns {string} Constants based on parsed data
 */
export default function(options) {
	/** Merged options. */
	const opts = Object.assign({}, pluginDefaults, options);

	/** File extensions we're using. */
	const extensions = opts.extensions.join("|").replace(/^\./g, "");

	/** Regex for finding those files in the source. */
	const fileRegex = new RegExp(`\\.(?:${extensions})$`, "i");

	return {
		name: "gray-matter",
		// Looks for the content Markdown files and returns constants of their data instead
		transform(src, id) {
			if (fileRegex.test(id)) {
				const obj = matter(src, opts);

				const output = config?.parseJournal
					? [
						`const data = ${JSON.stringify(obj?.data)}`,
						`const content = ${JSON.stringify(obj?.content)}`,
						`export { data, content }`,
					]
					: [
						`const data = ${JSON.stringify(obj?.data)}`,
						`export { data }`,
					];

				return {
					code: output.join("\n"),
				};
			}
		},
	};
}
