import type { GroupedSection } from "./types";

type Props = {
	section: GroupedSection;
	isFirst: boolean;
};

export default function TalkGallerySectionHeader({ section, isFirst }: Props) {
	return (
		<div className={isFirst ? "" : "pt-12"}>
			<div className="flex flex-wrap items-baseline justify-between gap-3">
				<h3 className="text-xl font-semibold text-white sm:text-2xl">
					{section.label}
				</h3>
				<span className="text-xs text-slate-400">{section.count} 件</span>
			</div>
		</div>
	);
}
