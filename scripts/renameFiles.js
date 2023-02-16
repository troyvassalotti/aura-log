/**
 * @file Rename all the content files using the proper date/time format.
 * @summary Not relevant since standardizing the content names.
 */

import matter from "gray-matter";
import minimist from "minimist";
import { readdir, readFileSync, rename } from "node:fs";
import { parse } from "node:path";
import globals from "../lib/globals.js";

/** CLI arguments. */
const argv = minimist(process.argv.slice(2));

/** Type of rename to be done. */
const { type } = argv;

/** Where all the logs are stored. */
const dir = `./${globals.contentDir}`;

/** File extension for aura log. */
const fileExtension = "auralog";

// Rename content to match expected file names
if (type === "date") {
	renameToDate();
}

// Rename content to have the aura log file extension
if (type === "ext") {
	renameWithExtension();
}

/**
 * Rename files to use the date and time front matter as the name.
 * @deprecated Only used in the initial migration process.
 * @returns {void}
 */
function renameToDate() {
	readdir(dir, (err, files) => {
		if (err) {
			throw err;
		}

		files.forEach((file) => {
			/** The full string contents of the file. */
			const str = readFileSync(dir + "/" + file, "utf8");

			/** Get the front matter object. */
			const frontmatter = matter(str);

			/** Parse the file. */
			const fileInfo = parse(file);

			/** File name without extension. */
			const fileName = fileInfo.name;

			/** Remove dashes from the file name. */
			const newDate = fileName.replaceAll("-", "");

			/** Remove semicolons from the time string. */
			const newTime = frontmatter.data.time.replace(":", "");

			/** Create a new file name with the date and time in YYYYMMDDHHMM format. */
			const newFileName = `${newDate}${newTime}.md`;

			// Rename the file.
			rename(`${dir}/${fileName}.md`, `${dir}/${newFileName}`, (err) => {
				if (err) throw err;

				console.log("Rename complete!");
			});
		});
	});
}

/**
 * Rename all content files to use a custom file extension.
 * @returns {void}
 */
function renameWithExtension() {
	readdir(dir, (err, files) => {
		if (err) {
			throw err;
		}

		files.forEach((file) => {
			/** Parse the file. */
			const fileInfo = parse(file);

			/** File name without extension. */
			const fileName = fileInfo.name;

			/** Create a new file name with the date and time in YYYYMMDDHHMM format. */
			const newFileName = `${fileName}.${fileExtension}.md`;

			// Rename the file.
			rename(`${dir}/${fileName}.md`, `${dir}/${newFileName}`, (err) => {
				if (err) throw err;

				console.log("Rename complete!");
			});
		});
	});
}
