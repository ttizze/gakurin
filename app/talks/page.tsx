import type { Metadata } from "next";
import Header from "../_components/header";
import { buildTalkGalleryTalks } from "../application/talk/gallery";
import Footer from "../components/footer";
import TalkGallery from "../components/talk-gallery";
import type { TalkForDisplay } from "../domain/talk/types";
import { getTalks } from "../infrastructure/talk/repository";

export const metadata: Metadata = {
	title: "法話一覧 | 初期仏教塾",
	description:
		"アルボムッレ・スマナサーラ長老の法話を、検索・年代ジャンプで一覧できます。",
};

export default async function TalksPage() {
	const talks = await getTalks();
	const talksForDisplay: TalkForDisplay[] = buildTalkGalleryTalks(talks);

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1">
				<Header />
				<section className="mx-auto max-w-7xl px-6 pt-8 sm:px-8 sm:pt-10">
					<p className="text-xs font-semibold tracking-[0.1em] text-amber-700">
						法話コンテンツ
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
						法話一覧
					</h1>
					<p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
						キーワード検索や年代ジャンプで、聴きたい法話を探せます。
					</p>
				</section>

				<div className="mx-auto max-w-7xl">
					<main className="px-6 py-8 sm:px-8 sm:py-10">
						<TalkGallery talks={talksForDisplay} />
					</main>
				</div>
			</div>

			<Footer />
		</div>
	);
}
