export type TranscriptCue = {
	index: number;
	start: number;
	end: number;
	startLabel: string;
	endLabel: string;
	text: string;
};

type ParsedTime = {
	seconds: number;
	label: string;
};

function pad(num: number, size = 2) {
	return String(num).padStart(size, "0");
}

function parseTime(raw: string): ParsedTime | null {
	const match = raw.trim().match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
	if (!match) return null;
	const [, hh, mm, ss, ms] = match;
	const hours = Number(hh);
	const minutes = Number(mm);
	const seconds = Number(ss);
	const millis = Number(ms);
	if ([hours, minutes, seconds, millis].some((value) => Number.isNaN(value)))
		return null;
	const totalSeconds = hours * 3600 + minutes * 60 + seconds + millis / 1000;
	const label = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
	return { seconds: totalSeconds, label };
}

export function parseSrt(content: string): TranscriptCue[] {
	const normalized = content.replace(/\r/g, "").trim();
	if (!normalized) return [];

	const blocks = normalized.split(/\n{2,}/);
	const cues: TranscriptCue[] = [];
	let fallbackIndex = 1;

	for (const block of blocks) {
		const lines = block.split("\n").map((line) => line.trim());
		if (lines.length < 2) continue;

		let lineIndex = 0;
		let cueIndex = fallbackIndex;
		if (/^\d+$/.test(lines[0])) {
			cueIndex = Number(lines[0]);
			lineIndex += 1;
		}

		const timingLine = lines[lineIndex];
		const timingMatch = timingLine.match(
			/(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/,
		);
		if (!timingMatch) {
			fallbackIndex += 1;
			continue;
		}

		const start = parseTime(timingMatch[1]);
		const end = parseTime(timingMatch[2]);
		if (!start || !end) {
			fallbackIndex += 1;
			continue;
		}

		const text = lines.slice(lineIndex + 1).join("\n").trim();
		if (!text) {
			fallbackIndex += 1;
			continue;
		}

		cues.push({
			index: Number.isNaN(cueIndex) ? fallbackIndex : cueIndex,
			start: start.seconds,
			end: end.seconds,
			startLabel: start.label,
			endLabel: end.label,
			text,
		});
		fallbackIndex += 1;
	}

	return cues;
}
