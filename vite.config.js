/** @format */

import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {cwd} from "node:process";
import {mergeConfig} from "vite";
import generateFile from "vite-plugin-generate-file";
import handlebars from "vite-plugin-handlebars";
import config from "./src/lib/AuralogConfig.js";
import data from "./src/plugins/generate-files.js";

/** Directory of this package. */
const __dirname = dirname(fileURLToPath(import.meta.url));

class ViteConfig {
	static get cwd() {
		return cwd();
	}

	static configFileName = "vite.config.js";

	static get userConfigPath() {
		return resolve(this.cwd, this.configFileName);
	}

	static async fetchUserConfig() {
		try {
			const userConfig = await import(this.userConfigPath);
			return userConfig.default;
		} catch (error) {
			console.log("No user vite config found. Using defaults...", error);
			return {};
		}
	}

	static defaultConfig = {
		build: {
			rollupOptions: {
				// Use auralog package index.html instead of process CWD
				input: {
					main: resolve(__dirname, "index.html"),
				},
				// Maintain output at process root instead of package (node_modules) root
				output: {
					dir: resolve(cwd(), "dist"),
				},
			},
		},
		plugins: [
			generateFile([
				{
					type: "json",
					output: "./headaches.json",
					data,
				},
			]),
			handlebars({
				context: {
					title: config?.html?.title,
					description: config?.html?.description,
					meta: config?.html?.meta,
					allowRobots: config?.allowRobots,
				},
			}),
		],
		preview: {
			open: "/",
		},
		server: {
			open: "/node_modules/@troyv/auralog/index.html",
		},
	};
}

export default mergeConfig(
	ViteConfig.defaultConfig,
	ViteConfig.fetchUserConfig(),
	false,
);
