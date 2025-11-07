import TalkGallery from "./components/talk-gallery";
import {
	SAMPLE_TALK_DATA,
	SAMPLE_TALK_KEYS,
	SAMPLE_YOUTUBE_VIDEOS,
} from "./lib/sample-data";
import { getYouTubeInfo } from "./lib/youtube";

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
	youtubeUrl: string | null;
	thumbnailUrl: string | null;
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

	// サンプルデータとしてYouTube動画を追加
	const sampleTalks: Talk[] = SAMPLE_TALK_KEYS.map((key) => ({
		key,
		folder: "",
		event: "サンプル講演",
		venue: "オンライン",
		recordedOn: "",
		recordedOnDate: null,
		duration: SAMPLE_TALK_DATA[key].duration,
		title: SAMPLE_TALK_DATA[key].title,
		description: SAMPLE_TALK_DATA[key].description,
		speaker: "サンプル講師",
		language: "日本語",
		format: "動画",
		audioLink: null,
		attachmentsLink: null,
	}));

	talks.push(...sampleTalks);

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
	const talks = await getTalks();

	// サンプルデータを分離して先頭に配置
	const sampleTalks = talks.filter((talk) =>
		SAMPLE_TALK_KEYS.includes(talk.key as keyof typeof SAMPLE_YOUTUBE_VIDEOS),
	);
	const otherTalks = talks.filter(
		(talk) =>
			!SAMPLE_TALK_KEYS.includes(
				talk.key as keyof typeof SAMPLE_YOUTUBE_VIDEOS,
			),
	);

	const sortedOtherTalks = otherTalks.sort((a, b) => {
		const aTime = a.recordedOnDate?.getTime() ?? 0;
		const bTime = b.recordedOnDate?.getTime() ?? 0;
		return bTime - aTime;
	});

	const allTalks = [...sampleTalks, ...sortedOtherTalks];

	const talksForDisplay: TalkForDisplay[] = allTalks.map((talk, index) => {
		const displayTitle =
			talk.title || talk.description || talk.event || "タイトル未設定";
		const subtitle =
			talk.description &&
			talk.title &&
			talk.description.trim() !== talk.title.trim()
				? talk.description
				: "";
		const isSampleData = SAMPLE_TALK_KEYS.includes(
			talk.key as keyof typeof SAMPLE_YOUTUBE_VIDEOS,
		);
		const year = talk.recordedOnDate?.getFullYear() ?? null;
		const decade = year ? Math.floor(year / 10) * 10 : null;
		const decadeLabel = isSampleData
			? "最新"
			: decade
				? `${decade}年代`
				: "年代不明";
		const themeSource = (talk.description || talk.event || "").trim();
		const themeLabel = themeSource || "テーマ未設定";

		// YouTube情報を取得
		const youtubeUrl =
			isSampleData && talk.key in SAMPLE_YOUTUBE_VIDEOS
				? SAMPLE_YOUTUBE_VIDEOS[talk.key as keyof typeof SAMPLE_YOUTUBE_VIDEOS]
				: talk.audioLink;
		const { youtubeUrl: finalYoutubeUrl, thumbnailUrl } =
			getYouTubeInfo(youtubeUrl);

		// サンプルデータ（年代不明）を一番上に表示するため、nullの場合は最大値を設定
		const recordedOnSortValue =
			talk.recordedOnDate?.getTime() ?? Number.MAX_SAFE_INTEGER;

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
			youtubeUrl: finalYoutubeUrl,
			thumbnailUrl,
			recordedOnRaw: talk.recordedOn || "日付不明",
			recordedOnFormatted: formatJapaneseDate(
				talk.recordedOn,
				talk.recordedOn || "日付不明",
			),
			recordedOnSortValue,
			decadeLabel,
			themeLabel,
		};
	});

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<header className="border-b border-orange-700 bg-orange-600">
				<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:px-8">
					<div>
						<span className="text-xs uppercase tracking-[0.3em] text-orange-100">
							GAKURIN
						</span>
						<h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
							学林
						</h1>
					</div>
					<p className="max-w-2xl text-sm leading-relaxed text-orange-50 sm:text-base">
						初期仏教の法話や講演を横断的に閲覧できる、静かな学びの場。
						場所やテーマ、記録された日時を頼りに、必要な教えを見つけてください。
					</p>
					<div className="flex flex-wrap gap-3 text-sm">
						<div className="rounded-full bg-orange-700 px-4 py-1.5 text-white border border-orange-800">
							収録数 {talksForDisplay.length} 件
						</div>
						<div className="rounded-full bg-orange-700 px-4 py-1.5 text-white border border-orange-800">
							更新頻度 約 1 時間
						</div>
					</div>
				</div>
			</header>

			<section className="border-b border-gray-200 bg-gray-50">
				<div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
					<h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
						初めての方へ
					</h2>
					<div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700 sm:text-base">
						<p>
							「仏教」と聞くと「宗教でしょ？」と感じる方もいらっしゃるかもしれません。しかし、2500年以上前にお釈迦様が説かれた教えは、「自分で確かめる」「権威ある人から言われたことでも盲信しない」という、いわゆる宗教とはほど遠い、理性的で現代的な教えです。
						</p>
						<p>
							お釈迦様の教えの目的は「苦しみをなくす」こと。人間の苦しみの根本的な原因は今も昔も変わりません。そのため、この教えに触れた方は「なんと現代的な教えだろう」という感想を持たれます。
						</p>
						<p>
							一般的な宗教では「信じる者は救われる」という立場ですが、初期仏教では、あなた自身の「智慧」や「優しさ」をレベルアップさせて、苦しみを乗り越えることを目指します。ストレスだらけの現代社会を生きる私たちにとって、今日からでも実践できる教えがここにあります。
						</p>
						<p>
							この「学林」では、そうした初期仏教の法話や講演を横断的に閲覧できます。それが本当かどうかは、ぜひ音声を聴いていただき、あなたご自身の心で確かめてみてください。
						</p>
					</div>
				</div>
			</section>

			<main className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
				<TalkGallery talks={talksForDisplay} />
			</main>

			<footer className="border-t border-gray-200 bg-gray-50">
				<div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-gray-500 sm:px-8">
					© {new Date().getFullYear()} 学林 — 初期仏教音声アーカイブ
				</div>
			</footer>
		</div>
	);
}
