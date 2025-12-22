import type { TalkForDisplay } from "../page";
import { formatJapaneseDate } from "./date";
import type { Talk } from "./talks";
import { getYouTubeInfo } from "./youtube";

export function transformTalkToDisplay(
	talk: Talk,
	index: number,
): TalkForDisplay {
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

	const youtubeUrl = talk.youtubeLink || talk.audioLink;
	const { youtubeUrl: finalYoutubeUrl, thumbnailUrl } =
		getYouTubeInfo(youtubeUrl);

	const recordedOnSortValue = talk.recordedOnDate?.getTime() ?? 0;
	const recordedOnRaw = talk.recordedOn || "日付不明";

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
		recordedOnRaw,
		recordedOnFormatted: formatJapaneseDate(talk.recordedOnDate, recordedOnRaw),
		recordedOnSortValue,
		decadeLabel,
		themeLabel,
	};
}
