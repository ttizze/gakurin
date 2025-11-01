import { Fragment, type ReactNode } from "react";

type Range = {
	start: number;
	end: number;
};

type NormalizedSlice = {
	originalStart: number;
	originalEnd: number;
	normalizedStart: number;
	normalizedEnd: number;
	normalized: string;
};

type Part = {
	text: string;
	highlight: boolean;
};

const HIGHLIGHT_CLASS = "rounded bg-amber-500/40 px-0.5 text-white";

export function highlightMatches(
	value: string | null | undefined,
	tokens: string[],
): ReactNode {
	if (!value) {
		return value ?? null;
	}

	const normalizedTokens = Array.from(
		new Set(
			tokens
				.map((token) => token.normalize("NFKC").toLowerCase())
				.filter(Boolean),
		),
	);

	if (normalizedTokens.length === 0) {
		return value;
	}

	const { slices, normalizedValue } = buildNormalizedSlices(value);

	if (!normalizedValue) {
		return value;
	}

	const matchedRanges = collectNormalizedRanges(
		normalizedValue,
		normalizedTokens,
	);
	if (matchedRanges.length === 0) {
		return value;
	}

	const mergedRanges = mergeRanges(matchedRanges);
	const originalRanges = mergedRanges
		.map((range) => mapNormalizedRangeToOriginal(range, slices))
		.filter((range): range is Range => range.start < range.end);

	if (originalRanges.length === 0) {
		return value;
	}

	const parts = buildParts(value, originalRanges);

	return parts.map((part, index) =>
		part.highlight ? (
			<mark className={HIGHLIGHT_CLASS} key={index}>
				{part.text}
			</mark>
		) : (
			<Fragment key={index}>{part.text}</Fragment>
		),
	);
}

function buildNormalizedSlices(value: string) {
	const slices: NormalizedSlice[] = [];
	let normalizedCursor = 0;
	let originalCursor = 0;

	for (const char of value) {
		const normalized = char.normalize("NFKC").toLowerCase();
		const originalStart = originalCursor;
		const originalEnd = originalStart + char.length;
		const normalizedStart = normalizedCursor;
		const normalizedEnd = normalizedStart + normalized.length;

		slices.push({
			originalStart,
			originalEnd,
			normalizedStart,
			normalizedEnd,
			normalized,
		});

		normalizedCursor = normalizedEnd;
		originalCursor = originalEnd;
	}

	return {
		slices,
		normalizedValue: slices.map((slice) => slice.normalized).join(""),
	};
}

function collectNormalizedRanges(value: string, tokens: string[]): Range[] {
	const ranges: Range[] = [];

	tokens.forEach((token) => {
		let searchIndex = value.indexOf(token);
		while (searchIndex !== -1) {
			ranges.push({
				start: searchIndex,
				end: searchIndex + token.length,
			});
			searchIndex = value.indexOf(token, searchIndex + token.length);
		}
	});

	return ranges;
}

function mergeRanges(ranges: Range[]): Range[] {
	if (ranges.length <= 1) {
		return ranges.slice();
	}

	const sorted = ranges
		.slice()
		.sort((a, b) => a.start - b.start || a.end - b.end);
	const merged: Range[] = [];
	let current = sorted[0];

	for (let i = 1; i < sorted.length; i += 1) {
		const range = sorted[i];
		if (range.start <= current.end) {
			current = {
				start: current.start,
				end: Math.max(current.end, range.end),
			};
		} else {
			merged.push(current);
			current = range;
		}
	}

	merged.push(current);
	return merged;
}

function mapNormalizedRangeToOriginal(
	range: Range,
	slices: NormalizedSlice[],
): Range {
	if (slices.length === 0) {
		return { start: 0, end: 0 };
	}

	let start = slices[slices.length - 1].originalEnd;
	let end = slices[slices.length - 1].originalEnd;

	for (const slice of slices) {
		if (range.start < slice.normalizedEnd) {
			start = slice.originalStart;
			break;
		}
	}

	for (const slice of slices) {
		if (range.end <= slice.normalizedEnd) {
			end = slice.originalEnd;
			break;
		}
	}

	return { start, end };
}

function buildParts(value: string, ranges: Range[]): Part[] {
	const parts: Part[] = [];
	let cursor = 0;

	ranges.forEach(({ start, end }) => {
		if (start > cursor) {
			parts.push({
				text: value.slice(cursor, start),
				highlight: false,
			});
		}

		if (end > start) {
			parts.push({
				text: value.slice(start, end),
				highlight: true,
			});
		}

		cursor = Math.max(cursor, end);
	});

	if (cursor < value.length) {
		parts.push({
			text: value.slice(cursor),
			highlight: false,
		});
	}

	return parts;
}
