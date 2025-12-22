const SHEET_URL =
	"https://docs.google.com/spreadsheets/d/1QMyakqH1i-W_bbK3yJl7u_Q_Jb_AoM94W6F8Gg3y3CA/export?format=csv&gid=909287277";

export type Talk = {
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
	youtubeLink: string | null;
	summary: string;
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

// CSVテキストを行に分割（引用符内の改行を考慮）
function splitCSVLines(text: string): string[] {
	const lines: string[] = [];
	let current = "";
	let insideQuotes = false;

	for (let i = 0; i < text.length; i += 1) {
		const char = text[i];
		const nextChar = text[i + 1];

		if (char === '"') {
			if (insideQuotes && nextChar === '"') {
				// エスケープされた引用符
				current += '"';
				i += 1;
			} else {
				// 引用符の開始/終了
				insideQuotes = !insideQuotes;
				current += char;
			}
			continue;
		}

		if (
			(char === "\n" || (char === "\r" && nextChar === "\n")) &&
			!insideQuotes
		) {
			// 引用符の外での改行のみ行の区切りとして扱う
			if (char === "\r" && nextChar === "\n") {
				i += 1; // \r\nをスキップ
			}
			const trimmed = current.trim();
			if (trimmed.length > 0) {
				lines.push(trimmed);
			}
			current = "";
			continue;
		}

		current += char;
	}

	// 最後の行を追加
	const trimmed = current.trim();
	if (trimmed.length > 0) {
		lines.push(trimmed);
	}

	return lines;
}

function parseCSVToTalks(text: string): Talk[] {
	const lines = splitCSVLines(text);

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
	const usedKeys = new Set<string>();

	for (let i = 1; i < lines.length; i += 1) {
		const line = lines[i];
		if (!line) {
			continue;
		}

		const cells = splitCSVLine(line);

		// 非公開がFALSEの場合はスキップ
		const isPrivate = getValue(cells, "非公開");
		if (isPrivate === "FALSE") {
			continue;
		}

		const event = getValue(cells, "行事名");
		const title = getValue(cells, "タイトル");
		const description = getValue(cells, "内容");

		if (!event && !title && !description) {
			continue;
		}

		// 収録日1と収録日2がある場合は結合、なければ単一の収録日を使用
		// ヘッダー名のバリエーション（スペース、全角半角の違いなど）に対応
		const recordedOn1 = getValueFromHeaders(cells, [
			"収録日1",
			"収録日 1",
			"収録日１",
			"収録日 １",
		]);
		const recordedOn2 = getValueFromHeaders(cells, [
			"収録日2",
			"収録日 2",
			"収録日２",
			"収録日 ２",
		]);
		const recordedOnSingle = getValueFromHeaders(cells, ["収録日", "収録日 "]);

		// デバッグ: 日付が取得できていない場合にログを出力
		if (!recordedOn1 && !recordedOn2 && !recordedOnSingle) {
			const id = getValue(cells, "ID");
			const title = getValue(cells, "タイトル");
			console.warn(
				`[Talks] 日付が取得できませんでした。行 ${i + 1}, ID: ${id}, タイトル: ${title?.substring(0, 50)}...`,
			);
			const dateHeaders = Object.keys(headerIndex).filter(
				(h) => h.includes("収録") || h.includes("日"),
			);
			console.warn(`[Talks] 日付関連ヘッダー:`, dateHeaders);
			// 実際のセルの値を確認（日付関連のヘッダーのインデックスに対応するセル）
			dateHeaders.forEach((header) => {
				const idx = headerIndex[header];
				if (idx !== undefined && cells[idx]) {
					console.warn(
						`[Talks]   ${header} (インデックス ${idx}): "${cells[idx]}"`,
					);
				}
			});
		}

		const recordedOn =
			recordedOn1 && recordedOn2
				? `${recordedOn1} / ${recordedOn2}`
				: recordedOn1 || recordedOn2 || recordedOnSingle;

		// IDフィールドの取得（ヘッダー名のバリエーションに対応）
		const id = getValueFromHeaders(cells, ["ID", "id", "Id", "ＩＤ", "ｉｄ"]);
		const baseKey = id || `${i}-${event || "event"}-${recordedOn || "date"}`;

		// デバッグ: IDが取得できていない場合にログを出力
		if (!id) {
			console.warn(
				`[Talks] IDが取得できませんでした。行 ${i + 1}, event: ${event}, タイトル: ${title?.substring(0, 50)}...`,
			);
			const idHeaders = Object.keys(headerIndex).filter(
				(h) =>
					h.toUpperCase().includes("ID") ||
					h.includes("ｉｄ") ||
					h.includes("ＩＤ"),
			);
			console.warn(`[Talks] ID関連ヘッダー:`, idHeaders);
			idHeaders.forEach((header) => {
				const idx = headerIndex[header];
				if (idx !== undefined && cells[idx]) {
					console.warn(
						`[Talks]   ${header} (インデックス ${idx}): "${cells[idx]}"`,
					);
				}
			});
		}

		// 重複キーを防ぐ
		let uniqueKey = baseKey;
		let suffix = 1;
		while (usedKeys.has(uniqueKey)) {
			uniqueKey = `${baseKey}-${suffix}`;
			suffix += 1;
		}
		usedKeys.add(uniqueKey);

		const talk: Talk = {
			key: uniqueKey,
			folder: getValueFromHeaders(cells, ["Dropboxフォルダー名"]),
			event,
			venue: getValue(cells, "収録場所"),
			recordedOn,
			recordedOnDate:
				parseDate(recordedOn1 || recordedOnSingle) ||
				parseDate(recordedOn2) ||
				null,
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
			youtubeLink: sanitizeLink(
				getValueFromHeaders(cells, ["YouTube", "YouTubeリンク", "youtube"]) ||
					(cells[12] ? cells[12].trim() : ""), // m列（13列目、0-indexedで12）を直接取得
			),
			summary: getValue(cells, "概要") || (cells[8] ? cells[8].trim() : ""), // I列（9列目、0-indexedで8）を直接取得
		};

		talks.push(talk);
	}

	return talks;
}

export async function getTalks(): Promise<Talk[]> {
	try {
		const response = await fetch(SHEET_URL, {
			headers: {
				Accept: "text/csv",
			},
			next: {
				revalidate: 60 * 60 * 24, // 1日（24時間）ごとに更新
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
