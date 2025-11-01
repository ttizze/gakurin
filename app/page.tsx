import TalkGallery from "./components/talk-gallery";

const SHEET_URL =
	"https://docs.google.com/spreadsheets/d/1QMyakqH1i-W_bbK3yJl7u_Q_Jb_AoM94W6F8Gg3y3CA/export?format=csv&gid=909287277";

type Talk = {
	key: string;
	folder: string;
	event: string;
	venue: string;
	recordedOn: string;
	recordedOnDate: Date | null;
	duration: string;
	title: string;
	description: string;
	speaker: string;
	language: string;
	format: string;
	audioLink: string | null;
	attachmentsLink: string | null;
};

export type TalkForDisplay = {
	key: string;
	event: string;
	title: string;
	subtitle: string;
	venue: string;
	speaker: string;
	duration: string;
	language: string;
	audioLink: string | null;
	attachmentsLink: string | null;
	recordedOnRaw: string;
	recordedOnFormatted: string;
	recordedOnSortValue: number;
	decadeLabel: string;
	themeLabel: string;
};

function splitCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = "";
	let insideQuotes = false;

	for (let i = 0; i < line.length; i += 1) {
		const char = line[i];
		if (char === '"') {
			if (insideQuotes && line[i + 1] === '"') {
				current += '"';
				i += 1;
			} else {
				insideQuotes = !insideQuotes;
			}
			continue;
		}

		if (char === "," && !insideQuotes) {
			result.push(current);
			current = "";
			continue;
		}

		current += char;
	}

	result.push(current);
	return result;
}

function parseDate(value: string): Date | null {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const withoutWeekday = trimmed.replace(/（[^)]+）|\([^)]+\)/g, "");
	const normalized = withoutWeekday
		.replace(/\./g, "/")
		.replace(/[年月]/g, "/")
		.replace(/日/g, "")
		.replace(/-+/g, "/")
		.replace(/\/+/g, "/")
		.replace(/^\/|\/$/g, "");

	const [yearRaw, monthRaw, dayRaw] = normalized
		.split("/")
		.map((part) => part.trim())
		.filter((part) => part.length > 0);

	const year = Number(yearRaw);
	const month = Number(monthRaw);
	const day = Number(dayRaw);

	if (
		Number.isNaN(year) ||
		Number.isNaN(month) ||
		Number.isNaN(day) ||
		year < 1000
	) {
		return null;
	}

	const date = new Date(year, month - 1, day);
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date;
}

function sanitizeLink(value: string): string | null {
	const trimmed = value.trim();
	if (!trimmed || trimmed === "-" || trimmed === "#") {
		return null;
	}
	return trimmed;
}

function parseCSVToTalks(text: string): Talk[] {
	const lines = text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length === 0) {
		return [];
	}

	const headerCells = splitCSVLine(lines[0]);
	const headerIndex = headerCells.reduce<Record<string, number>>(
		(accumulator, header, index) => {
			accumulator[header.trim()] = index;
			return accumulator;
		},
		{},
	);

	const getValue = (cells: string[], header: string): string => {
		const index = headerIndex[header];
		if (index === undefined) {
			return "";
		}
		return (cells[index] ?? "").trim();
	};

	const getValueFromHeaders = (cells: string[], headers: string[]): string => {
		for (const header of headers) {
			const value = getValue(cells, header);
			if (value) {
				return value;
			}
		}
		return "";
	};

	const talks: Talk[] = [];

	for (let i = 1; i < lines.length; i += 1) {
		const line = lines[i];
		if (!line) {
			continue;
		}

		const cells = splitCSVLine(line);
		const event = getValue(cells, "行事名");
		const title = getValue(cells, "タイトル");
		const description = getValue(cells, "内容");

		if (!event && !title && !description) {
			continue;
		}

		const recordedOn = getValue(cells, "収録日");
		const talk: Talk = {
			key:
				getValue(cells, "ID") ||
				`${i}-${event || "event"}-${recordedOn || "date"}`,
			folder: getValueFromHeaders(cells, ["Dropboxフォルダー名"]),
			event,
			venue: getValue(cells, "収録場所"),
			recordedOn,
			recordedOnDate: parseDate(recordedOn),
			duration: getValue(cells, "収録時間"),
			title,
			description,
			speaker: getValue(cells, "講師"),
			language: getValue(cells, "言語"),
			format: getValueFromHeaders(cells, [
				"音声フォーマット",
				"ファイルのフォーマット",
			]),
			audioLink: sanitizeLink(
				getValueFromHeaders(cells, ["リンク", "音源リンク"]),
			),
			attachmentsLink: sanitizeLink(
				getValueFromHeaders(cells, [
					"添付データ（スライド、サマリー等）",
					"添付データ",
				]),
			),
		};

		talks.push(talk);
	}

	return talks;
}

function formatJapaneseDate(value: string, fallback: string): string {
	const date = parseDate(value);
	if (!date) {
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

async function getTalks(): Promise<Talk[]> {
	try {
		const response = await fetch(SHEET_URL, {
			headers: {
				Accept: "text/csv",
			},
			next: {
				revalidate: 60 * 60,
			},
		});

		if (!response.ok) {
			console.error("Failed to fetch sheet data", response.statusText);
			return [];
		}

		const text = await response.text();
		return parseCSVToTalks(text);
	} catch (error) {
		console.error("Unable to fetch sheet data", error);
		return [];
	}
}

export default async function Home() {
	const talks = (await getTalks()).sort((a, b) => {
		const aTime = a.recordedOnDate?.getTime() ?? 0;
		const bTime = b.recordedOnDate?.getTime() ?? 0;
		return bTime - aTime;
	});

	const talksForDisplay: TalkForDisplay[] = talks.map((talk, index) => {
		const displayTitle =
			talk.title || talk.description || talk.event || "タイトル未設定";
		const subtitle =
			talk.description &&
			talk.title &&
			talk.description.trim() !== talk.title.trim()
				? talk.description
				: "";
		const year = talk.recordedOnDate?.getFullYear() ?? null;
		const decade = year ? Math.floor(year / 10) * 10 : null;
		const decadeLabel = decade ? `${decade}年代` : "年代不明";
		const themeSource = (talk.description || talk.event || "").trim();
		const themeLabel = themeSource || "テーマ未設定";

		return {
			key: talk.key || `talk-${index}`,
			event: talk.event || "未分類",
			title: displayTitle,
			subtitle,
			venue: talk.venue || "—",
			speaker: talk.speaker || "—",
			duration: talk.duration || "—",
			language: talk.language || "—",
			audioLink: talk.audioLink,
			attachmentsLink: talk.attachmentsLink,
			recordedOnRaw: talk.recordedOn || "日付不明",
			recordedOnFormatted: formatJapaneseDate(
				talk.recordedOn,
				talk.recordedOn || "日付不明",
			),
			recordedOnSortValue: talk.recordedOnDate?.getTime() ?? 0,
			decadeLabel,
			themeLabel,
		};
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
			<header className="border-b border-white/10 bg-black/20 backdrop-blur">
				<div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 sm:px-8">
					<div>
						<span className="text-xs uppercase tracking-[0.4em] text-slate-300">
							GAKURIN
						</span>
						<h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
							学林
						</h1>
					</div>
					<p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
						初期仏教の法話や講演を横断的に閲覧できる、静かな学びの場。
						場所やテーマ、記録された日時を頼りに、必要な教えを見つけてください。
					</p>
					<div className="flex flex-wrap gap-4 text-sm text-slate-300">
						<div className="rounded-full border border-white/15 px-4 py-1.5 backdrop-blur">
							収録数 {talksForDisplay.length} 件
						</div>
						<div className="rounded-full border border-white/15 px-4 py-1.5 backdrop-blur">
							更新頻度 約 1 時間
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
				<TalkGallery talks={talksForDisplay} />
			</main>

			<footer className="border-t border-white/10 bg-black/40">
				<div className="mx-auto max-w-5xl px-6 py-6 text-center text-[13px] text-slate-400 sm:px-8">
					© {new Date().getFullYear()} 学林 — 初期仏教音声アーカイブ
				</div>
			</footer>
		</div>
	);
}
