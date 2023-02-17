# Aura Log

**Aura Log** is a starter kit for keeping track of your headaches and visualizing their patterns. It was originally started as - and continues to be a - way for me (Troy) to keep tabs on my migraines.

## How It Works

Vite powers the build, Lit creates the components, Plop helps with the logging, and dprint does all the formatting.

Entries are Markdown files kept in `src/entries` with YAML front matter to store the data. It is possible to also write a journal entry as standard Markdown, but it isn't exposed by the app to any data sources by default.

During build, those entries are parsed for their front matter and content, which creates JavaScript data that Vite can transform into a dataset, which components can accept and render.

## Getting Started

Fork this repository, clone it locally, and `npm install` to get started. Sample entries are already present to give an overview of how it all pieces together, so run `npm start` to see the result in your browser.

`npm run log` will start the interactive logging process. You technically don't need to do it this way, but it streamlines the whole thing. You could choose to hand author your `.md` files, but then it's up to you to format them properly.

## Setup

Settings are handled in `auralog.config.js`, where you can choose what options are available for plop. This package uses a plugin to render handlebars templates as the `index.html`, so config data will be used on your web page.

The components are in `src/components` and aren't extensive are extendable out of the box, but if you choose to use this then you can customize them as you wish.

Styles are in `src/assets`, and utility functions are in `lib`.

A few niceties are in `scripts` to handle repo-management type things, but they don't do anything related to Aura Log itself.

`plugins` is where the code for the Markdown parser and `vite-plugin-generate-file` settings exist. That file plugin creates a `.json` file of your entries at the root of `dist`, for fun.

`plop-templates` is where the Markdown file used for entries can be adjusted, but it gets its data from Plop and your interactive logging, so be mindful of changes to that.

## Documentation

Look, I made this for myself and thought it might be fun to share with others. I initially planned on creating an `npm` package out of it with all the features of a small framework, but decided that was far too much work than I cared for. So, this is what you get.

I documented all the code with JSDocs because that's a thing I do, and I'm happy to answer any questions you may have (just open an issue), but please don't expect a ton of support. This thing is meant to be useable with a single config file, but extendable if you wish to make it that way.
