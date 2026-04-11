/**
 * Essay-specific MDX component registry.
 *
 * Maps essay slugs to their custom components so they are only loaded
 * when that particular essay is rendered — keeping the shared
 * mdxComponents bundle free of one-off demo code.
 */

import DetailComparison, { ComparisonOption } from "./DetailComparison";
import {
	DetailDemoStyles,
	ButtonLabelA, ButtonLabelB,
	PlaceholderLabelA, PlaceholderLabelB,
	ErrorMessageA, ErrorMessageB,
	ConfirmationA, ConfirmationB,
	EmptyStateWordingA, EmptyStateWordingB,
	DestructiveActionA, DestructiveActionB,
	EmailWordingA, EmailWordingB,
	ChangelogA, ChangelogB,
	LoadingStateA, LoadingStateB,
} from "./DetailDemos";

const essayComponents: Record<string, Record<string, any>> = {
	"wording-in-interfaces": {
		DetailComparison,
		ComparisonOption,
		DetailDemoStyles,
		ButtonLabelA, ButtonLabelB,
		PlaceholderLabelA, PlaceholderLabelB,
		ErrorMessageA, ErrorMessageB,
		ConfirmationA, ConfirmationB,
		EmptyStateWordingA, EmptyStateWordingB,
		DestructiveActionA, DestructiveActionB,
		EmailWordingA, EmailWordingB,
		ChangelogA, ChangelogB,
		LoadingStateA, LoadingStateB,
	},
};

export function getEssayComponents(slug: string): Record<string, any> {
	return essayComponents[slug] ?? {};
}
