import type { TalkForDisplay } from "../page";
import { formatJapaneseDate } from "./date";
import type { Talk } from "./talk-types";
import { getYouTubeInfo } from "./youtube";

// 改行文字をスペースに置き換えて連結する
function normalizeText(text: string): string {
	return text
		.replace(/\r\n/g, " ") // Windows改行
		.replace(/\n/g, " ") // Unix改行
		.replace(/\r/g, " ") // Mac改行
		.replace(/\s+/g, " ") // 連続する空白を1つに
		.trim();
}

export function transformTalkToDisplay(
	talk: Talk,
	index: number,
): TalkForDisplay {
	const rawTitle =
		talk.title || talk.description || talk.event || "タイトル未設定";
	const displayTitle = normalizeText(rawTitle);

	const rawSubtitle =
		talk.description &&
		talk.title &&
		talk.description.trim() !== talk.title.trim()
			? talk.description
			: "";
	const subtitle = rawSubtitle ? normalizeText(rawSubtitle) : "";

	const year = talk.recordedOnDate?.getFullYear() ?? null;
	const decade = year ? Math.floor(year / 10) * 10 : null;
	const decadeLabel = decade ? `${decade}年代` : "年代不明";
	const themeSource = (talk.description || talk.event || "").trim();
	const themeLabel = themeSource || "テーマ未設定";

	const youtubeUrl = talk.youtubeLink || talk.audioLink;
	const { youtubeUrl: finalYoutubeUrl, thumbnailUrl } =
		getYouTubeInfo(youtubeUrl);

	const recordedOnSortValue = talk.recordedOnDate?.getTime() ?? 0;
	const recordedOnRaw = talk.recordedOn || "日付不明";
	const summary = talk.summary || "";
	const summaryPreview =
		summary.length > 100 ? `${summary.slice(0, 100)}...` : summary;

	return {
		id: talk.id || `talk-${index}`,
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
		recordedOnRaw,
		recordedOnFormatted: formatJapaneseDate(talk.recordedOnDate, recordedOnRaw),
		recordedOnSortValue,
		decadeLabel,
		themeLabel,
		summary,
		summaryPreview,
	};
}
