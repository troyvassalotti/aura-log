<!-- @format -->

# Aura Log

**Aura Log** is a starter kit for keeping track of your headaches and visualizing their patterns. It was originally started as - and continues to be a - way for me to keep tabs on my migraines.

## How It Works

A directory of Markdown files serves as the database for all logs. Each file is named with the YYYYMMDDHHMM format when the migraine happened and contains YAML front matter with key:value pairs of meta information.

During build, those entries generate a JSON file that is fetched client-side and parsed for the dashboard to render.

## Getting Started

1. Install via npm: `npm install @troyv/auralog`.
2. Run `npx auralog` to be presented with an interactive CLI for completing an entry.
3. Run `npx auralog start` to preview a development server, or `npx auralog build` to bundle for production.

> Use `npx auralog help` for a list of all available commands.

## Setup

Aura Log comes with a default set of options in the logging process, but can be configured by writing your own `auralog.config.js` file in your project root.

```js
// auralog.config.js
// Check AuralogConfig.js for all the default options
// User options are merged with or overwrite default options, depending on the type
export default {
	html: {
		title: "Change the title of your web page.",
		description: "Change the meta description.",
		meta: [
			{
				name: "meta name",
				content: "meta content",
			},
		],
	},
	contentDir: "path/to/logs",
	medications: ["Medicine One", "Medicine Two"], // definitely add your own
	painAreas: ["Where it hurts"],
	parseJournal: true | false, // true if you want your journal entries output in the JSON
	symptoms: ["Symptoms you experience"],
	triggers: ["What", "might", "cause your migraines"],
};
```

The dashboard uses a combination of Highcharts and D3 charts.
