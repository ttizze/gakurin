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

export function tokenizeSearchQuery(query: string): string[] {
	if (!query) {
		return [];
	}

	const normalized = normalizeForSearch(query);
	if (!normalized) {
		return [];
	}

	return normalized.split(" ").filter(Boolean);
}

export function fuzzyMatch(source: string, query: string): boolean {
	if (!query) {
		return true;
	}

	return source.includes(query);
}

export function filterTalks(indexedTalks: IndexedTalk[], tokens: string[]) {
	if (tokens.length === 0) {
		return indexedTalks.map((item) => item.data);
	}

	return indexedTalks
		.filter(({ searchText }) =>
			tokens.every((token) => fuzzyMatch(searchText, token)),
		)
		.map(({ data }) => data);
}
