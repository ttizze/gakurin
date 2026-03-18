"use client";

import Link from "next/link";
import TalkGalleryRow from "../components/talk-gallery/talk-gallery-row";
import type { TalkForDisplay } from "../domain/talk/types";

type Props = {
	talks: TalkForDisplay[];
};

const RECOMMENDED_COUNT = 3;
const NOOP = () => {};

export default function RecommendedTalks({ talks }: Props) {
	const recommendedTalks = talks.slice(0, RECOMMENDED_COUNT);

	return (
		<section aria-labelledby="recommended-talks-heading" className="space-y-5">
			<div className="flex items-end justify-between gap-4">
				<div>
					<h2
						className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl"
						id="recommended-talks-heading"
					>
						おすすめ法話
					</h2>
				</div>
				<Link
					className="inline-flex items-center rounded-full border border-amber-300 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-50"
					href="/talks"
				>
					法話一覧を見る
				</Link>
			</div>

			<TalkGalleryRow
				columns={3}
				isFirstRow
				onNavigateToTalk={NOOP}
				searchTokens={[]}
				talks={recommendedTalks}
			/>
		</section>
	);
}
