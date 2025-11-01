import type { TalkForDisplay } from "../../page";
import type { GroupedSection } from "./types";

export function buildDecadeSections(talks: TalkForDisplay[]): GroupedSection[] {
	const map = new Map<string, TalkForDisplay[]>();

	talks.forEach((talk) => {
		const bucket = map.get(talk.decadeLabel);
		if (bucket) {
			bucket.push(talk);
		} else {
			map.set(talk.decadeLabel, [talk]);
		}
	});

	return Array.from(map.entries())
		.map(([decadeLabel, groupedTalks]) => {
			const getSortValue = (talk: TalkForDisplay) =>
				talk.recordedOnSortValue > 0
					? talk.recordedOnSortValue
					: Number.POSITIVE_INFINITY;

			const sortedTalks = groupedTalks
				.slice()
				.sort((a, b) => getSortValue(a) - getSortValue(b));

			const earliest = getSortValue(sortedTalks[0]);

			return {
				label: decadeLabel,
				talks: sortedTalks,
				count: groupedTalks.length,
				sortKey:
					decadeLabel === "年代不明" ? Number.POSITIVE_INFINITY : earliest,
			};
		})
		.sort((a, b) => a.sortKey - b.sortKey);
}

export function buildThemeSections(talks: TalkForDisplay[]): GroupedSection[] {
	const map = new Map<string, TalkForDisplay[]>();

	talks.forEach((talk) => {
		const key = talk.themeLabel;
		const bucket = map.get(key);
		if (bucket) {
			bucket.push(talk);
		} else {
			map.set(key, [talk]);
		}
	});

	return Array.from(map.entries())
		.map(([themeLabel, groupedTalks]) => {
			const priority = themeLabel === "テーマ未設定" ? 1 : 0;
			return {
				label: themeLabel,
				talks: groupedTalks.sort(
					(a, b) => b.recordedOnSortValue - a.recordedOnSortValue,
				),
				count: groupedTalks.length,
				sortKey: priority,
			};
		})
		.sort((a, b) => {
			if (a.sortKey !== b.sortKey) {
				return a.sortKey - b.sortKey;
			}
			return a.label.localeCompare(b.label, "ja");
		});
}

export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
	if (chunkSize <= 0) {
		return [items];
	}

	const chunks: T[][] = [];

	for (let i = 0; i < items.length; i += chunkSize) {
		chunks.push(items.slice(i, i + chunkSize));
	}

	return chunks;
}
