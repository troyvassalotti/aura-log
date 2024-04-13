import { defineConfig } from "vite";
import generateFile from "vite-plugin-generate-file";
import handlebars from "vite-plugin-handlebars";
import config from "./src/auralog.config.js";
import data from "./src/plugins/generate-files.js";

export default defineConfig({
  plugins: [
    generateFile([
      {
        type: "json",
        output: "headaches.json",
        data,
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
