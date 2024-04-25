/**
 * Vite outputs the `index.html` to a subdirectory of the output folder,
 * as a result of specifying a resolved input path. This module moves the
 * nested `index.html` to the desired destination at the root of the output.
 *
 * @format
 * @file MoveIndexFile
 */

import {existsSync, mkdirSync, rmSync, copyFileSync} from "node:fs";
import {resolve, parse} from "node:path";

export default class MoveIndexFile {
  static outputDir = "dist";
  static index = "index.html";
  static viteRootDirs = ["node_modules", "@troyv", "auralog"];
  static resolvedViteDirs = resolve(this.outputDir, ...this.viteRootDirs);
  static source = resolve(this.resolvedViteDirs, this.index);
  static destination = resolve(this.outputDir, this.index);
  static parsedDestination = parse(this.destination);

  static move() {
    if (!existsSync(this.source)) {
      console.log("Aura Log Ready!")
      return;
    }

	console.log(`Moving ${this.index} from ${this.source} to ${this.destination}.`);

	if (!existsSync(this.parsedDestination.dir)) {
		console.log(`${this.parsedDestination.dir} doesn't exist. Creating it now...`);

		mkdirSync(this.parsedDestination.dir, {recursive: true});
	}

	copyFileSync(this.source, this.destination);

	console.log("Cleaning up empty directories...");

	rmSync(resolve(this.outputDir, this.viteRootDirs[0]), {
		recursive: true,
		force: true,
	});

	console.log("Move complete!");
	console.log("Aura Log Ready!");
  }
}
