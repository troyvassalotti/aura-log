import { defineConfig } from "vite";
import generateFile from "vite-plugin-generate-file";
import handlebars from "vite-plugin-handlebars";
import config from "./auralog.config";
import mdPlugin from "./plugins/front-matter";
import { data } from "./plugins/generate-files";

export default defineConfig({
	base: "/aura-log/",
	plugins: [
		mdPlugin(config.contentPluginOptions),
		generateFile([
			{
				type: "json",
				output: "headaches.json",
				data: data,
			},
		]),
		handlebars({
			context: {
				title: config?.html?.title,
				meta: config?.html?.meta,
				allowRobots: config?.allowRobots,
			},
		}),
	],
});
