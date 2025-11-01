import { useEffect, useMemo, useState } from "react";
import type { TalkForDisplay } from "../../page";
import {
	buildDecadeSections,
	buildThemeSections,
	chunkArray,
} from "./grouping";
import { createIndexedTalks, filterTalks, tokenizeSearchQuery } from "./search";
import type { GroupedSection, IndexedTalk, ViewMode } from "./types";

export type TalkGalleryVirtualRow = {
	section: GroupedSection;
	groupIndex: number;
	rowIndex: number;
	talks: TalkForDisplay[];
};

export function useTalkGalleryData(
	talks: TalkForDisplay[],
	viewMode: ViewMode,
	searchQuery: string,
) {
	const [columns, setColumns] = useState(1);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 640px)");
		const updateColumns = () => setColumns(mediaQuery.matches ? 2 : 1);

		updateColumns();
		mediaQuery.addEventListener("change", updateColumns);

		return () => {
			mediaQuery.removeEventListener("change", updateColumns);
		};
	}, []);

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
			return {
				groups: [] as Array<{
					section: GroupedSection;
					rows: TalkForDisplay[][];
				}>,
				groupCounts: [] as number[],
				flatRows: [] as TalkGalleryVirtualRow[],
			};
		}

		const groups = sections.map((section) => ({
			section,
			rows: chunkArray(section.talks, columns).filter((row) => row.length > 0),
		}));

		const groupCounts: number[] = [];
		const flatRows: TalkGalleryVirtualRow[] = [];

		groups.forEach((group, groupIndex) => {
			groupCounts.push(group.rows.length);
			group.rows.forEach((talksInRow, rowIndex) => {
				flatRows.push({
					section: group.section,
					groupIndex,
					rowIndex,
					talks: talksInRow,
				});
			});
		});

		return { groups, groupCounts, flatRows };
	}, [columns, sections]);

	return {
		columns,
		filteredTalks,
		sections,
		searchTokens,
		...virtualData,
	};
}
