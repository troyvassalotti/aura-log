import { dateValidation, generatePrompt } from "./plopHelpers.js";

/**
 * Prompts for date/time, sleep.
 * @type {Array<{type: string, name: string, message: string, validate?: any}>}
 */
export const metaPrompts = [
	generatePrompt(
		"input",
		"date",
		"When did it happen? (in YYYYMMDDHHMM format)",
		undefined,
		dateValidation,
	),
	generatePrompt("confirm", "sleep", "Did it happen in your sleep?"),
];

/**
 * Prompts for writing a journal entry with your log.
 * @type {Array<[{type: string, name: string, message: string, validate?: any, when?: any}]>}
 */
export const journalPrompts = [
	generatePrompt("confirm", "journal", "Do you want to write an entry for this log?"),
	generatePrompt("editor", "entry", undefined, undefined, undefined, function(answers) {
		return answers.journal;
	}),
];
