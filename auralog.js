#!/usr/bin/env node

import { Command } from "commander";
import { build, createServer, preview } from "vite";
import { Plop, run } from "plop";
import pkg from "./package.json" with { type: "json" };

const program = new Command();

program.name(pkg.name).description(pkg.description).version(pkg.version);

program
  .command("build")
  .description(
    "Build your Aura Log for production. Files are output into `dist`.",
  )
  .action(() => {
    build();
  });

program
  .command("preview")
  .description(
    "Preview your Aura Log as production. Requires initial build first.",
  )
  .action(async () => {
    const server = await preview();
    console.log(`Listening on ${server.resolvedUrls.local}`);
  });

program
  .command("dev")
  .alias("start")
  .description("Run the Aura Log dev server.")
  .action(async () => {
    const server = await createServer();
    const start = await server.listen();
    console.log(`Listening on ${start.resolvedUrls.local}`);
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
        configPath: "./plopfile.js",
      },
      (env) => Plop.execute(env, run),
    );
  });

program.parse();
