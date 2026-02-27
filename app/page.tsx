import Footer from "./components/footer";
import ForBeginnersSection from "./components/for-beginners-section";
import Header from "./components/header";
import ScrollToTopButton from "./components/scroll-to-top-button";
import TalkGallery from "./components/talk-gallery";
import type { TalkForDisplay } from "./lib/talk-display";
import { transformTalkToDisplay } from "./lib/talk-transform";
import { getTalks } from "./lib/talks";

export default async function Home() {
	const talks = await getTalks();

	const sortedTalks = [...talks].sort((a, b) => {
		const aTime = a.recordedOnDate?.getTime() ?? 0;
		const bTime = b.recordedOnDate?.getTime() ?? 0;
		return bTime - aTime;
	});

	const talksForDisplay: TalkForDisplay[] = sortedTalks.map((talk, index) =>
		transformTalkToDisplay(talk, index),
	);

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1">
				<Header />
				<div id="for-beginners">
					<ForBeginnersSection />
				</div>

				<div className="mx-auto max-w-7xl">
					<main className="px-6 py-12 sm:px-8">
						<TalkGallery talks={talksForDisplay} />
					</main>
				</div>
			</div>

			<ScrollToTopButton />
			<Footer />
		</div>
	);
}
