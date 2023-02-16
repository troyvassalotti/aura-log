import config from "./auralog.config.js";
import { journalPrompts, metaPrompts } from "./lib/defaultPrompts.js";
import globals from "./lib/globals.js";
import { choiceValidation, generatePrompt, templateSubstring } from "./lib/plopHelpers.js";

// Start with the global prompts
const prompts = [...metaPrompts];

// Triggers
if (!config.disableTriggers) {
	prompts.push(
		generatePrompt(
			"checkbox",
			"triggers",
			"What were the triggers?",
			config.triggers,
			choiceValidation,
		),
	);
}

// Symptoms
if (!config.disableSymptoms) {
	prompts.push(
		generatePrompt(
			"checkbox",
			"symptoms",
			"What were your symptoms?",
			config.symptoms,
			choiceValidation,
		),
	);
}

// Pain Areas
if (!config.disablePainAreas) {
	prompts.push(
		generatePrompt(
			"checkbox",
			"pain_areas",
			"What were your pain areas?",
			config.painAreas,
			choiceValidation,
		),
	);
}

// Medications
if (!config.disableMedications) {
	prompts.push(
		generatePrompt(
			"checkbox",
			"medications",
			"What medications did you take?",
			config.medications,
		),
	);
}

// Create any custom prompts if supplied
if (config.customPrompts) {
	const { customPrompts } = config;
	for (const prompt of customPrompts) {
		prompts.push(prompt);
	}
}

// End with the journal prompts
prompts.push(...journalPrompts);

export default function(plop) {
	plop.setHelper("substring", templateSubstring);

	plop.setGenerator("log", {
		description: "Log a new headache.",
		prompts,
		actions: [
			{
				type: "add",
				path: `${globals.contentDir}/{{date}}.md`,
				templateFile: "plop-templates/log.hbs",
			},
		],
	});
}
