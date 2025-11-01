import type { TalkForDisplay } from "../../page";

export type GroupedSection = {
	label: string;
	count: number;
	sortKey: number;
	talks: TalkForDisplay[];
};

export type IndexedTalk = {
	data: TalkForDisplay;
	searchText: string;
};

export type ViewMode = "date" | "theme";
