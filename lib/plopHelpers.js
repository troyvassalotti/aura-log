/**
 * Plop template helper to add substring support to handlebars template variables.
 * @param {string} text
 * @param {number} start
 * @param {number} end
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

/**
 * Quickly generate an object ready to be used by Plop.
 * @param {string} type Type of question
 * @param {string} name Data name for the question
 * @param {string} message Message to go along with the question
 * @param {(string | number)[]} choices Choices available
 * @param {any} validate Function for the "validate" hook
 * @param {any} when Function for the "when" hook
 * @returns {{type: string, name: string, message: string, choices: (string | number)[], validate?: any}}
 */
export function generatePrompt(type, name, message, choices, validate, when) {
	return {
		type,
		name,
		message,
		choices,
		validate,
		when,
	};
}
