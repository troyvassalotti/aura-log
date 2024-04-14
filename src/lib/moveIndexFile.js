/**
 * Vite outputs the `index.html` to a subdirectory of the output folder,
 * as a result of specifying a resolved input path. This module moves the
 * nested `index.html` to the desired destination at the root of the output.
 *
 * @format
 * @file moveIndexFile
 */

import {existsSync, mkdirSync, rmSync, copyFileSync} from "node:fs";
import {resolve, parse} from "node:path";

const outputDir = "dist";
const index = "index.html";
const viteRootDirs = ["node_modules", "auralog"];
const resolvedViteDirs = resolve(outputDir, ...viteRootDirs);

const source = resolve(resolvedViteDirs, index);
const destination = resolve(outputDir, index);
const parsedDestination = parse(destination);

export default function moveIndexFile() {
	if (!existsSync(source)) {
		console.log("Aura Log Ready!");
		return;
	}

	console.log(`Moving ${index} from ${source} to ${destination}.`);

	if (!existsSync(parsedDestination.dir)) {
		console.log(`${parsedDestination.dir} doesn't exist. Creating it now...`);

		mkdirSync(parsedDestination.dir, {recursive: true});
	}

	copyFileSync(source, destination);

	console.log("Cleaning up empty directories...");

	rmSync(resolve(outputDir, viteRootDirs[0]), {
		recursive: true,
		force: true,
	});

	console.log("Move complete!");
	console.log("Aura Log Ready!");
}
