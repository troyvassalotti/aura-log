#!/usr/bin/env node

/**
 * @todo Overhaul app to use Highcharts dashboard and Highcharts calendar heatmap, removing need for Lit or D3.
 * @todo Support merging vite configs.
 */

import { Command } from "commander";
import { build, createServer, preview } from "vite";
import { Plop, run } from "plop";
import pkg from "./package.json" with { type: "json" };
import auralogViteConfig from "./vite.config.js";
import moveIndexFile from "./src/lib/moveIndexFile.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const program = new Command();

program.name(pkg.name).description(pkg.description).version(pkg.version);

program
  .command("build")
  .description(
    "Build your Aura Log for production. Files are output into `dist`.",
  )
  .action(async () => {
    await build(auralogViteConfig);
    moveIndexFile();
  });

program
  .command("preview")
  .description("Preview your generated Aura Log. Requires initial build first.")
  .action(async () => {
    const server = await preview(auralogViteConfig);
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  });

program
  .command("dev")
  .alias("start")
  .description("Run the Aura Log dev server.")
  .action(async () => {
    const server = await createServer(auralogViteConfig);
    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  });

/**
 * @todo Figure out why `npx auralog add` attempts to pass "add" as the first input value which fails the validator
 */
program
  .command("add", { isDefault: true })
  .alias("write")
  .description("Add a new entry to your log.")
  .action(() => {
    Plop.prepare(
      {
        configPath: resolve(__dirname, "plopfile.js"),
      },
      (env) => Plop.execute(env, run),
    );
  });

program.parse();
