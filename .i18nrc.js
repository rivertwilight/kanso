const { defineConfig } = require("@lobehub/i18n-cli");

module.exports = defineConfig({
	entry: "src/i18n/resources/en-US.json",
	entryLocale: "zh",
	output: "src/i18n/resources",
	outputLocales: ["en"],
	modelName: "gpt-4o-mini",
	reference: "",
	markdown: {
		entry: ["content/crafts/zh/*.mdx"],
		entryLocale: "zh",
		outputLocales: ["en"],
		entryExtension: ".mdx",
		outputExtension: ".mdx",
		includeMatter: true,
	},
});
