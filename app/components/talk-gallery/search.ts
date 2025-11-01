import type { TalkForDisplay } from "../../page";
import type { IndexedTalk } from "./types";

export function normalizeForSearch(value: string): string {
	return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

export function buildSearchText(talk: TalkForDisplay): string {
	return normalizeForSearch(
		[
			talk.title,
			talk.subtitle,
			talk.event,
			talk.venue,
			talk.speaker,
			talk.language,
			talk.recordedOnFormatted,
			talk.recordedOnRaw,
			talk.decadeLabel,
			talk.themeLabel,
		]
			.filter(Boolean)
			.join(" "),
	);
}

export function createIndexedTalks(talks: TalkForDisplay[]): IndexedTalk[] {
	return talks.map((talk) => ({
		data: talk,
		searchText: buildSearchText(talk),
	}));
}

export function fuzzyMatch(source: string, query: string): boolean {
	if (!query) {
		return true;
	}

	if (source.includes(query)) {
		return true;
	}

	let cursor = 0;
	for (let i = 0; i < query.length; i += 1) {
		const char = query[i];
		const found = source.indexOf(char, cursor);
		if (found === -1) {
			return false;
		}
		cursor = found + 1;
	}

	return true;
}

export function filterTalks(indexedTalks: IndexedTalk[], query: string) {
	const trimmed = query.trim();
	if (!trimmed) {
		return indexedTalks.map((item) => item.data);
	}

	const tokens = normalizeForSearch(trimmed).split(" ").filter(Boolean);

	if (tokens.length === 0) {
		return indexedTalks.map((item) => item.data);
	}

	return indexedTalks
		.filter(({ searchText }) =>
			tokens.every((token) => fuzzyMatch(searchText, token)),
		)
		.map(({ data }) => data);
}
