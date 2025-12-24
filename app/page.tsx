import ForBeginnersSection from "./components/for-beginners-section";
import Header from "./components/header";
import TalkGallery from "./components/talk-gallery";
import { transformTalkToDisplay } from "./lib/talk-transform";
import { getTalks } from "./lib/talks";

export type TalkForDisplay = {
	key: string;
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

			<footer className="border-t border-gray-200 bg-amber-50">
				<div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-gray-500 sm:px-8">
					© {new Date().getFullYear()} 初期仏教塾 — 初期仏教音声アーカイブ
				</div>
			</footer>
		</div>
	);
}
