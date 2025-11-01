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
	return (
		<div className={isFirstRow ? "pt-6" : "pt-8"}>
			<div className={`grid gap-8 ${columns > 1 ? "sm:grid-cols-2" : ""}`}>
				{talks.map((talk) => (
					<TalkGalleryCard
						key={talk.key}
						searchTokens={searchTokens}
						talk={talk}
					/>
				))}
			</div>
		</div>
	);
}
