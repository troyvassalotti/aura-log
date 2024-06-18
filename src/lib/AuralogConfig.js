/** @format */

import {resolve} from "node:path";
import {cwd} from "node:process";
import {isArray, mergeWith} from "lodash-es";

function handleArrayMerging(objValue, srcValue) {
	if (isArray(objValue)) {
		return objValue.concat(srcValue);
	}
}

export class AuralogConfig {
	static get cwd() {
		return cwd();
	}

	static configFileName = "auralog.config.js";

	static get userConfigPath() {
		return resolve(this.cwd, this.configFileName);
	}

	static defaultConfig = {
		html: {
			title: "Aura Log",
			description: "My migraine log and dashboard.",
		},
		contentDir: "entries",
		medications: ["None"],
		painAreas: [
			"Front Left",
			"Front Right",
			"Back Left",
			"Back Right",
			"Left Eye",
			"Right Eye",
		],
		parseJournal: false,
		symptoms: [
			"Throbbing Pain",
			"Nausea",
			"Light Sensitivity",
			"Noise Sensitivity",
			"Blurred Vision",
			"Fatigue",
			"Neck Pain",
		],
		triggers: [
			"Stress",
			"Don't Know",
			"Weather",
			"Lack of Sleep",
			"Rebound",
			"Processed Foods",
			"Anxiety",
			"Alcohol",
			"Dehydration",
			"Fever",
			"Screen Time",
			"Caffeine",
			"Sun",
			"Hunger",
		],
		intensities: ["low", "medium", "high"],
	};

	config = null;

	async fetchUserConfig() {
		try {
			const userConfig = await import(AuralogConfig.userConfigPath);
			return userConfig.default;
		} catch (error) {
			console.error(error);
		}
	}

	async mergeConfigs() {
		try {
			const userConfig = await this.fetchUserConfig();
			const mergedConfig = mergeWith(
				AuralogConfig.defaultConfig,
				userConfig,
				handleArrayMerging,
			);

			return mergedConfig;
		} catch (error) {
			console.error(error);
		}
	}

	async setConfig() {
		try {
			const mergedConfig = await this.mergeConfigs();
			this.config = mergedConfig;
		} catch (error) {
			console.error(error);
		}
	}
}

async function configuration() {
	const Config = new AuralogConfig();
	await Config.setConfig();
	return Config.config;
}

const config = await configuration();

export default config;
