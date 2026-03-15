import type { TranscriptCue } from "../../domain/transcript/types";

const GAP_THRESHOLD_SECONDS = 2.5;
const MAX_PARAGRAPH_CHARS = 220;

function normalizeText(text: string) {
	return text
		.replace(/\s*\n\s*/g, " ")
		.replace(/\s{2,}/g, " ")
		.trim();
}

export function buildTranscriptParagraphs(cues: TranscriptCue[]) {
	const paragraphs: string[] = [];
	let buffer = "";
	let lastEnd = 0;
	let hasLastEnd = false;

	for (const cue of cues) {
		const clean = normalizeText(cue.text);
		if (!clean) continue;

		const gap = hasLastEnd ? cue.start - lastEnd : 0;
		const shouldBreak =
			buffer.length > 0 &&
			(gap >= GAP_THRESHOLD_SECONDS ||
				buffer.length + clean.length > MAX_PARAGRAPH_CHARS);

		if (shouldBreak) {
			paragraphs.push(buffer.trim());
			buffer = clean;
		} else {
			buffer = buffer ? `${buffer} ${clean}` : clean;
		}

		lastEnd = cue.end;
		hasLastEnd = true;
	}

	if (buffer.trim()) {
		paragraphs.push(buffer.trim());
	}

	return paragraphs;
}

export function buildCueTimeHref(
	embedUrlPrefix: string | null | undefined,
	startSeconds: number,
): string | null {
	if (!embedUrlPrefix) {
		return null;
	}
	return `${embedUrlPrefix}start=${startSeconds}&autoplay=1`;
}
