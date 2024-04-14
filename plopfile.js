/** @format */

import config from "./src/lib/AuralogConfig.js";
import {cwd} from "node:process";
import {resolve} from "node:path";

/**
 * Plop template helper to add substring support to handlebars template variables.
 * @param {string} text Raw text string.
 * @param {number} start Where to start the substring.
 * @param {number} end Where to cut the string at.
 * @returns {string}
 */
export function templateSubstring(text, start, end) {
	return text.substring(start, end);
}

/**
 * Validate logging choices to make sure at least one is selected.
 * @param {(string | number)[]} answer
 * @returns {string | boolean}
 */
export function choiceValidation(answer) {
	return answer.length < 1 ? "You must choose at least one." : true;
}

/**
 * Check that the date is entered correctly.
 * @param {string} answer
 * @returns {string | boolean}
 *
 * @todo Actually validate it as a Date instead of basing it solely on string length.
 */
export function dateValidation(answer) {
	if (answer.length > 12) {
		return "Your date is too long. Make sure it's in YYYYMMDDHHMM format.";
	}

	if (answer.length < 12) {
		return "Your date isn't long enough. Make sure it's in YYYYMMDDHHMM format.";
	}

	return true;
}

const prompts = [];

// Start with the global prompts
prompts.push(
	{
		type: "input",
		name: "date",
		message: "When did it happen? (in YYYYMMDDHHMM format)",
		validate: dateValidation,
	},
	{
		type: "confirm",
		name: "sleep",
		message: "Did it happen in your sleep?",
	},
);

// Triggers
if (!config.disableTriggers) {
	prompts.push({
		type: "checkbox",
		name: "triggers",
		message: "What were the triggers?",
		choices: config.triggers,
		validate: choiceValidation,
	});
}

// Symptoms
if (!config.disableSymptoms) {
	prompts.push({
		type: "checkbox",
		name: "symptoms",
		message: "What were your symptoms?",
		choices: config.symptoms,
		validate: choiceValidation,
	});
}

// Pain Areas
if (!config.disablePainAreas) {
	prompts.push({
		type: "checkbox",
		name: "pain_areas",
		message: "What were your pain areas?",
		choices: config.painAreas,
		validate: choiceValidation,
	});
}

// Medications
if (!config.disableMedications) {
	prompts.push({
		type: "checkbox",
		name: "medications",
		message: "What medications did you take?",
		choices: config.medications,
	});
}

/**
 * @todo
 * Figure out how to pass custom prompts into the plop template.
 * Custom prompts are asked but the template has no way of knowing they exist,
 * and if it did know they exist, how to format them.
 *
 */
// Create any custom prompts if supplied
// if (config.customPrompts) {
//   const { customPrompts } = config;
//   for (const prompt of customPrompts) {
//     prompts.push(prompt);
//   }
// }

// End with the journal prompts
prompts.push(
	{
		type: "confirm",
		name: "journal",
		message: "Do you want to write an entry for this log?",
	},
	{
		type: "editor",
		name: "entry",
		when: function (answers) {
			return answers.journal;
		},
	},
);

export default function (plop) {
	plop.setHelper("substring", templateSubstring);

	plop.setGenerator("log", {
		description: "Log a new headache.",
		prompts,
		actions: [
			{
				type: "add",
				path: resolve(cwd(), config.contentDir, "{{date}}.md"),
				templateFile: "src/plop-templates/log.hbs",
			},
		],
	});
}
