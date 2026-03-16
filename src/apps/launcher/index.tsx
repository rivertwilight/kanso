"use client";

import { Button, Section, SectionTitle } from "@/components/ui";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { IPost } from "@/types/index";
import CategoryLabel from "./components/CategoryLabel";
import PostList from "./components/PostList";
import BottomNav from "./components/BottomNav";
import BookGrid from "./components/BookGrid";
import ProjectScroller from "./components/ProjectScroller";
import AppToolbar from "@/system/components/AppToolbar";
import Image from "next/image";

const FRIEND_LINKS = [
	{ name: "Innei", url: "https://innei.in" },
	{ name: "Justin", url: "https://jsun.lol" },
	{ name: "pseudoyu", url: "https://www.pseudoyu.com" },
];

interface LauncherAppProps {
	allPosts: any;
	falttedPosts: IPost[];
	locale: string;
	projects: IPost[];
}

export default function LauncherApp(props: LauncherAppProps) {
	const { allPosts, falttedPosts, locale, projects } = props;
	const searchParams = useSearchParams();
	const activeTab = searchParams.get("tab") || "home";
	const t = useTranslations();

	useEffect(() => {
		const main = document.querySelector("main");
		if (main) main.scrollTop = 0;
	}, [activeTab]);

	return (
		<>
			<AppToolbar type="none" />
			<div className="pb-8">
				{activeTab === "home" && (
					<>
						<Section>
							{/* <SectionTitle label="Hello, I'm Rene." /> */}
							<div className="flex gap-4 items-center">
								<Image
									src="/icon/apple-icon-180x180.png"
									alt="Avatar"
									width={56}
									height={56}
									className="shrink-0 w-14 h-14"
								/>
								<div className="font-sans">
									Rene Wang <br />{" "}
									<span className="opacity-60">
										{" "}
										Design Engineer from China. I love
										crafting interface. Previously, I worked
										as enginner at ByteDance.
									</span>
								</div>
							</div>
						</Section>
						<Section>
							<SectionTitle
								label={t("homePage.features")}
								showArrow
							/>

							<ProjectScroller
								projects={projects.filter(p => p.frontmatter.featured)}
								locale={locale}
							/>
						</Section>
						<Section>
							<SectionTitle label="Essays" showArrow />

							<PostList
								falttedPosts={falttedPosts}
								locale={locale}
							/>
						</Section>
						<Section>
							<SectionTitle label="Friends" />
							<div className="flex flex-wrap gap-2">
								{FRIEND_LINKS.map((link) => (
									<a
										key={link.url}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<CategoryLabel
											text={link.name}
											selected={false}
											onClick={() => {}}
										/>
									</a>
								))}
							</div>
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
