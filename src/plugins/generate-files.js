/**
 * @format
 * @file Data given to vite-plugin-generate-file
 */

import {readdirSync, readFileSync, existsSync} from "node:fs";
import {cwd} from "node:process";
import {resolve} from "node:path";
import matter from "gray-matter";
import config from "../lib/AuralogConfig.js";

/** Where all the logs are stored. */
const dir = resolve(cwd(), config.contentDir);

/** Content files. */
function fetchContentFiles() {
	try {
		if (existsSync(dir)) {
			const content = readdirSync(dir, (err, files) => {
				if (err) {
					throw err;
				}

				return files;
			});
      
			return content;
		}
	} catch (error) {
		console.error(error);
	}
}

/** Content parsed for their front matter. */
function generateDateFile(files) {
	if (!files) {
		return;
	}

	return files.map((file) => {
		const str = readFileSync(resolve(dir, file), "utf8");
		const frontmatter = matter(str);
		const {data, content} = frontmatter;

    // DO NOT try and edit `data` directly because it introduces bugs where dates are wrong
    let finalObj = Object.assign({}, data);

		// If there's no date from the front matter, create it from the file name
		if (!finalObj.date) {
			/** The date & time string from the file name. */
			const fileName = file.replace(/(\D+\/+)(\d+)(.md)/, "$2");

			const year = fileName.substring(0, 4); /* YYYY */
			const month = fileName.substring(4, 6); /* MM */
			const day = fileName.substring(6, 8); /* DD */
			const isoDate = `${year}-${month}-${day}`; /* YYYY-MM-DD */

			const hour = fileName.substring(8, 10); /* HH */
			const minutes = fileName.substring(10, 12); /* MM */
			const isoTime = `${hour}:${minutes}`; /* HH:MM */

      finalObj.date = `${isoDate}T${isoTime}`; /* YYYY-MM-DDTHH:MM */
		}

		if (config.parseJournal) {
			return {...finalObj, content};
		}

		return finalObj;
	});
}

function main() {
	const files = fetchContentFiles();
	return generateDateFile(files);
}

const data = main();

export default data;
