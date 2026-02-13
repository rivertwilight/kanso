"use client";

import { useMemo } from "react";
import { useAtom } from "jotai";
import { activeCategoryAtom } from "./atoms";
import { Button, Section, SectionTitle } from "@/components/ui";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { IPost } from "@/types/index";
import Link from "next/link";
import CategoryLabel from "./components/CategoryLabel";
import PostList from "./components/PostList";
import BottomNav from "./components/BottomNav";
import BookGrid from "./components/BookGrid";
import ProjectScroller from "./components/ProjectScroller";
import AppToolbar from "@/system/components/AppToolbar";
import Image from "next/image";

interface LauncherAppProps {
	allPosts: any;
	falttedPosts: IPost[];
	locale: string;
	allCategories: { slug: string; config: { name: string } }[];
	projects: IPost[];
}

export default function LauncherApp(props: LauncherAppProps) {
	const { allPosts, falttedPosts, locale, allCategories, projects } = props;
	const [activeCategory, setActiveCategory] = useAtom(activeCategoryAtom);
	const searchParams = useSearchParams();
	const activeTab = searchParams.get("tab") || "home";
	const t = useTranslations();
	const tCommon = useTranslations("common");
	const tCategories = useTranslations("categories");

	const categoryLabels = useMemo<{ name: string; text: string }[]>(
		() =>
			[{ name: "All", text: tCommon("all") }].concat(
				allCategories.map((item) => {
					// Use translated name if available, fallback to slug
					const translatedName = tCategories.has(item.slug)
						? tCategories(item.slug)
						: item.slug;
					return { name: item.slug, text: translatedName };
				})
			),
		[allCategories, tCategories, tCommon]
	);

	return (
		<>
			<AppToolbar type="none" />
			<div className="pb-8">
				{activeTab === "home" && (
					<>
						<Section>
							<SectionTitle label="Hello, I'm Rene." />
							<div className="flex gap-4">
								<Image
									src="/icon/apple-icon-180x180.png"
									alt="Avatar"
									width={56}
									height={56}
									className="shrink-0 w-14 h-14"
								/>
								<div className="font-sans">
									I'm a design engineer at LobeHub from China. I previously work at ByteDance and Tiktok.
									I build interface and make things happen.
								</div>
							</div>
						</Section>
						<Section>
							<SectionTitle
								label={t("homePage.features")}
								showArrow
							/>

							<ProjectScroller
								projects={projects}
								locale={locale}
							/>
						</Section>
						<Section>
							<PostList
								activeCategory={activeCategory}
								allPosts={allPosts}
								falttedPosts={falttedPosts}
								locale={locale}
							/>
						</Section>
					</>
				)}

				{activeTab === "library" && (
					<Section>
						<BookGrid books={projects} locale={locale} />
					</Section>
				)}
			</div>
			<BottomNav locale={locale} />
		</>
	);
}
