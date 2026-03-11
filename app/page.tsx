import Footer from "./components/footer";
import ForBeginnersSection from "./components/for-beginners-section";
import Header from "./components/header";
import ScrollToTopButton from "./components/scroll-to-top-button";
import TalkGallery from "./components/talk-gallery";
import { buildTalkGalleryTalks } from "./application/talk/gallery";
import type { TalkForDisplay } from "./domain/talk/types";
import { getTalks } from "./infrastructure/talk/repository";

export default async function Home() {
	const talks = await getTalks();
	const talksForDisplay: TalkForDisplay[] = buildTalkGalleryTalks(talks);

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
