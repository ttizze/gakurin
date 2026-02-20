import { useEffect, useMemo, useState } from "react";
import type { TalkForDisplay } from "../../lib/talk-display";
import {
	buildDecadeSections,
	buildThemeSections,
	chunkArray,
} from "./grouping";
import { createIndexedTalks, filterTalks, tokenizeSearchQuery } from "./search";
import type {
	GroupedSection,
	IndexedTalk,
	TalkGalleryGroup,
	ViewMode,
} from "./types";

type TalkGalleryVirtualRow = {
	rowIndex: number;
	talks: TalkForDisplay[];
};

type TalkGalleryVirtualData = {
	groups: TalkGalleryGroup[];
	groupCounts: number[];
	flatRows: TalkGalleryVirtualRow[];
};

const MEDIA_QUERY_SM = "(min-width: 640px)";
const MEDIA_QUERY_LG = "(min-width: 1024px)";

function resolveColumnsByViewport(): number {
	if (window.matchMedia(MEDIA_QUERY_LG).matches) {
		return 3;
	}
	if (window.matchMedia(MEDIA_QUERY_SM).matches) {
		return 2;
	}
	return 1;
}

function useResponsiveColumns() {
	const [columns, setColumns] = useState(1);

	useEffect(() => {
		const updateColumns = () => {
			setColumns(resolveColumnsByViewport());
		};

		const mediaQuerySm = window.matchMedia(MEDIA_QUERY_SM);
		const mediaQueryLg = window.matchMedia(MEDIA_QUERY_LG);

		updateColumns();
		mediaQuerySm.addEventListener("change", updateColumns);
		mediaQueryLg.addEventListener("change", updateColumns);

		return () => {
			mediaQuerySm.removeEventListener("change", updateColumns);
			mediaQueryLg.removeEventListener("change", updateColumns);
		};
	}, []);

	return columns;
}

function buildVirtualData(
	sections: GroupedSection[],
	columns: number,
): TalkGalleryVirtualData {
	const groups = sections.map((section) => ({
		section,
		rows: chunkArray(section.talks, columns).filter((row) => row.length > 0),
	}));

	const groupCounts: number[] = [];
	const flatRows: TalkGalleryVirtualRow[] = [];

	groups.forEach((group) => {
		groupCounts.push(group.rows.length);
		group.rows.forEach((talksInRow, rowIndex) => {
			flatRows.push({
				rowIndex,
				talks: talksInRow,
			});
		});
	});

	return { groups, groupCounts, flatRows };
}

export function useTalkGalleryData(
	talks: TalkForDisplay[],
	viewMode: ViewMode,
	searchQuery: string,
) {
	const columns = useResponsiveColumns();

	const indexedTalks: IndexedTalk[] = useMemo(
		() => createIndexedTalks(talks),
		[talks],
	);

	const searchTokens = useMemo(
		() => tokenizeSearchQuery(searchQuery),
		[searchQuery],
	);

	const filteredTalks = useMemo(
		() => filterTalks(indexedTalks, searchTokens),
		[indexedTalks, searchTokens],
	);

	const sections = useMemo(() => {
		if (viewMode === "theme") {
			return buildThemeSections(filteredTalks);
		}
		return buildDecadeSections(filteredTalks);
	}, [filteredTalks, viewMode]);

	const virtualData = useMemo(() => {
		if (sections.length === 0) {
			return { groups: [], groupCounts: [], flatRows: [] };
		}
		return buildVirtualData(sections, columns);
	}, [columns, sections]);

	return {
		columns,
		filteredTalks,
		indexedTalks,
		sections,
		searchTokens,
		...virtualData,
	};
}
