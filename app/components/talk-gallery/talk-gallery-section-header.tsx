import { highlightMatches } from "./highlight";
import type { GroupedSection } from "./types";

type Props = {
	section: GroupedSection;
	isFirst: boolean;
	searchTokens: string[];
};

export default function TalkGallerySectionHeader({
	section,
	isFirst,
	searchTokens,
}: Props) {
	return (
		<div className={isFirst ? "" : "pt-12"}>
			<div className="flex flex-wrap items-baseline justify-between gap-3">
				<h3 className="text-xl font-semibold text-white sm:text-2xl">
					{highlightMatches(section.label, searchTokens)}
				</h3>
				<span className="text-xs text-slate-400">{section.count} 件</span>
			</div>
		</div>
	);
}
