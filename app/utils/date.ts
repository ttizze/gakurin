export function formatJapaneseDate(
	date: Date | null,
	fallback: string,
): string {
	if (!date || Number.isNaN(date.getTime())) {
		return fallback;
	}

	try {
		return new Intl.DateTimeFormat("ja-JP", {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "short",
		}).format(date);
	} catch {
		return fallback;
	}
}
