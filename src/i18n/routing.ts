import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["en"],

	// Used when no locale matches
	defaultLocale: "en",

	// The prefix for the locale in the URL
	localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
