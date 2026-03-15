import Footer from "./components/footer";
import ForBeginnersSection from "./components/for-beginners-section";
import ClientHomeActions from "./components/client-home-actions";
import DeferredTalkGallery from "./components/deferred-talk-gallery";
import Header from "./_components/header";
import Hero from "./_components/hero";
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
				<Hero />
				<div id="for-beginners">
					<ForBeginnersSection />
				</div>

				<div className="mx-auto max-w-7xl">
					<main className="px-6 py-12 sm:px-8">
						<DeferredTalkGallery talks={talksForDisplay} />
					</main>
				</div>
			</div>

			<ClientHomeActions />
			<Footer />
		</div>
	);
}
