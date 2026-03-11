import { useEffect, useMemo, useState } from "react";
import {
	buildDecadeSections,
	buildThemeSections,
	buildVirtualGalleryData,
} from "../../application/talk/grouping";
import {
	buildSearchIndex,
	filterTalksByQuery,
	tokenizeSearchQuery,
	type IndexedTalk,
} from "../../application/talk/search";
import type { TalkForDisplay } from "../../domain/talk/types";
type ViewMode = "date" | "theme";

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

export function useTalkGalleryData(
	talks: TalkForDisplay[],
	viewMode: ViewMode,
	searchQuery: string,
) {
	const columns = useResponsiveColumns();

	const indexedTalks: IndexedTalk[] = useMemo(
		() => buildSearchIndex(talks),
		[talks],
	);

	const searchTokens = useMemo(
		() => tokenizeSearchQuery(searchQuery),
		[searchQuery],
	);

	const filteredTalks = useMemo(
		() => filterTalksByQuery(indexedTalks, searchTokens),
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
		return buildVirtualGalleryData(sections, columns);
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
