import type { TalkForDisplay } from "../../page";
import TalkGalleryCard from "./talk-gallery-card";

type Props = {
	talks: TalkForDisplay[];
	isFirstRow: boolean;
	columns: number;
	searchTokens: string[];
};

export default function TalkGalleryRow({
	talks,
	isFirstRow,
	columns,
	searchTokens,
}: Props) {
	const gridClass =
		columns === 3
			? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
			: columns === 2
				? "grid-cols-1 sm:grid-cols-2"
				: "grid-cols-1";

	return (
		<div className={isFirstRow ? "pt-6" : "pt-8"}>
			<div className={`grid gap-8 ${gridClass}`}>
				{talks.map((talk) => (
					<TalkGalleryCard
						key={talk.id}
						searchTokens={searchTokens}
						talk={talk}
					/>
				))}
			</div>
		</div>
	);
}
