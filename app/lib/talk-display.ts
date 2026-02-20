import type { Talk } from "./talk-types";

export type TalkForDisplay = {
	id: string;
	dvdId: string;
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
	summary: string;
	summaryPreview: string;
};

export function getTalkTitle(
	talk: Pick<Talk, "title" | "description" | "event">,
	fallback = "タイトル未設定",
): string {
	return talk.title || talk.description || talk.event || fallback;
}

export function getPrimaryTalkMediaUrl(
	talk: Pick<Talk, "youtubeLink" | "audioLink">,
): string | null {
	return talk.youtubeLink || talk.audioLink || null;
}
