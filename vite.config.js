import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import generateFile from "vite-plugin-generate-file";
import handlebars from "vite-plugin-handlebars";
import config from "./src/auralog.config.js";
import data from "./src/plugins/generate-files.js";

/** Directory of this package. */
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      // Use auralog package index.html instead of process CWD
      input: {
        main: resolve(__dirname, "index.html"),
      },
      // Maintain output at process root instead of package (node_modules) root
      output: {
        dir: resolve(process.cwd(), "dist"),
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
        meta: config?.html?.meta,
        allowRobots: config?.allowRobots,
      },
    }),
  ],
  server: {
    open: "/node_modules/auralog/index.html",
  },
});
