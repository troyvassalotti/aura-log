/**
 * @file Data given to vite-plugin-generate-file
 */

import matter from "gray-matter";
import { readdirSync, readFileSync } from "node:fs";
import config from "../auralog.config";
import globals from "../lib/globals";

/** Where all the logs are stored. */
const dir = `./${globals.contentDir}`;

/** Content files. */
const content = readdirSync(dir, (err, files) => {
	if (err) {
		throw err;
	}

	return files;
});

/** Content parsed for their front matter. */
export const data = content.map(file => {
	const str = readFileSync(dir + "/" + file, "utf8");
	const frontmatter = matter(str);
	const { data, content } = frontmatter;

	if (config.parseJournal) {
		return { data, content };
	}

	return { data };
});
