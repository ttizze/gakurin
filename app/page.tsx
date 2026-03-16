import Header from "./_components/header";
import Hero from "./_components/hero";
import HomeValuePoints from "./_components/home-value-points";
import RecommendedTalks from "./_components/recommended-talks";
import SumanasaraProfile from "./_components/sumanasara-profile";
import { buildTalkGalleryTalks } from "./application/talk/gallery";
import ClientHomeActions from "./components/client-home-actions";
import Footer from "./components/footer";
import ForBeginnersSection from "./components/for-beginners-section";
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
				<HomeValuePoints />
				<SumanasaraProfile />

				<div className="mx-auto max-w-7xl">
					<main className="px-6 py-12 sm:px-8">
						<RecommendedTalks talks={talksForDisplay} />
					</main>
				</div>

				<div id="for-beginners">
					<ForBeginnersSection />
				</div>
			</div>

			<ClientHomeActions />
			<Footer />
		</div>
	);
}
