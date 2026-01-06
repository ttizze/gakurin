import Footer from "./components/footer";
import ForBeginnersSection from "./components/for-beginners-section";
import Header from "./components/header";
import ScrollToTopButton from "./components/scroll-to-top-button";
import TalkGallery from "./components/talk-gallery";
import { transformTalkToDisplay } from "./lib/talk-transform";
import { getTalks } from "./lib/talks";
import type { Metadata } from "next";

export type TalkForDisplay = {
	id: string;
	dvdId: string;
	event: string;
	title: string;
	subtitle: string;
	venue: string;
	speaker: string;
	duration: string;
	language: string;
	audioLink: string | null;
	attachmentsLink: string | null;
	youtubeUrl: string | null;
	thumbnailUrl: string | null;
	recordedOnRaw: string;
	recordedOnFormatted: string;
	recordedOnSortValue: number;
	decadeLabel: string;
	themeLabel: string;
	summary: string;
	summaryPreview: string;
};

export function generateMetadata(): Metadata {
	return {
		title: "初期仏教塾",
		description: "スマナサーラ長老の珠玉の法話で学ぶ。",
		openGraph: {
			title: "初期仏教塾",
			description: "スマナサーラ長老の珠玉の法話で学ぶ。",
		},
		twitter: {
			title: "初期仏教塾",
			description: "スマナサーラ長老の珠玉の法話で学ぶ。",
		},
	};
}

export default async function Home() {
	const talks = await getTalks();

	const sortedTalks = talks.sort((a, b) => {
		const aTime = a.recordedOnDate?.getTime() ?? 0;
		const bTime = b.recordedOnDate?.getTime() ?? 0;
		return bTime - aTime;
	});

	const talksForDisplay: TalkForDisplay[] = sortedTalks.map((talk, index) =>
		transformTalkToDisplay(talk, index),
	);

	return (
		<div className="min-h-screen">
			<Header />
			<div id="for-beginners">
				<ForBeginnersSection />
			</div>

			<div className="mx-auto max-w-7xl">
				<main className="px-6 py-12 sm:px-8">
					<TalkGallery talks={talksForDisplay} />
				</main>
			</div>

			<ScrollToTopButton />
			<Footer />
		</div>
	);
}
